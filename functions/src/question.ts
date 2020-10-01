import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { firestoreDB, makeRef } from './dbRefs';
import { subjectConverter } from './subject';
import { assertString } from './typeassertions';
const auth = admin.auth;
/**
 * Question Class - Stores information about a question being asked by a student
 */
class Question {
    /**
     * Constructor
     * @param name Name of group asking question
     * @param question Question text
     * @param askTime Timestamp that the question was asked
     * @param teacher_id ID of teacher that responds to the question
     * @param answerTime Timestamp when the question was answered
     * @param teacherName Name of the teacher responding
     */
    constructor(public name: string, public question: string, public askTime: Date, public teacher_id?: string, public answerTime?: Date, public teacherName?: string) { }
}
const Timestamp = admin.firestore.Timestamp;



const questionConverter = {
    toFirestore(question: Question): FirebaseFirestore.DocumentData {
        const askTime = Timestamp.fromDate(question.askTime)
        // let answerTime:FirebaseFirestore.Timestamp|undefined;
        // const intermediate = {}
        if (question.answerTime) {
            const answerTime = Timestamp.fromDate(question.answerTime);
            return { ...question, answerTime, askTime }
        } else {
            return { ...question, askTime }
        }

    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Question {
        const data = snapshot.data();
        const answerTime = <FirebaseFirestore.Timestamp | undefined>data.answerTime;
        const askTime = <FirebaseFirestore.Timestamp>data.askTime;
        return new Question(data.name, data.question, askTime.toDate(), data.teacher_id, answerTime?.toDate(), data.teacherName);
        // return new Question(data.id,data.name,data.question,askTime.toDate(), data.teacher_id ,answerTime?.toDate());
    }
}

type questionRequestData = {
    action?: string,
    name?: string,
    id?: string,
    subject_id: string,
    group_id: string,
    session_id: string,
    updateAction?: string
}
const questionRequest = functions.https.onCall((data: questionRequestData, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    return firestoreDB.runTransaction(async transaction => {
        try {
            assertString(data.subject_id, "Subject ID");
            assertString(data.group_id, "Group ID");
            assertString(data.session_id, "Session ID");
        } catch (error) {
            throw new functions.https.HttpsError('not-found', error)
        }
        const subjectRef = makeRef.subjects.withConverter(subjectConverter).doc(data.subject_id);
        const subject = (await transaction.get(subjectRef)).data()
        if (!subject) {
            throw new functions.https.HttpsError('not-found', 'Subject not found')
        }
        if (!(subject?.isOwner(uid))) {
            // if false (not owner then throw error)
            throw new functions.https.HttpsError('permission-denied', "Not the subject owner");
        }
        // Requester has permissions: now check for the desired action:
        switch (data.action) {
            case 'update':
                return update(data, transaction, uid);
            //Implement later
            /* case 'delete':
            return remove(data, transaction, group, groupRef); */

            default:
                //return an error
                throw new functions.https.HttpsError('invalid-argument',
                    'Invalid classGroup action request');
        }
    })
})

async function update(data: questionRequestData, transaction: FirebaseFirestore.Transaction, uid: string) {
    const question_id = data.id;
    try {
        if (!question_id) { throw new Error('Question ID in API field: id') }
        assertString(question_id, "Question ID in API field 'id'");
    } catch (error) {
        throw new functions.https.HttpsError('not-found', error)
    }
    const questionRef = makeRef.questions(data.session_id, data.group_id, data.subject_id).doc(question_id).withConverter(questionConverter);
    const questionSS = (await transaction.get(questionRef))
    const questionDoc = questionSS.data();
    if (!questionSS.exists || !questionDoc) {
        throw new functions.https.HttpsError('not-found', 'Question not found');
    }
    if (!data.updateAction) {
        throw new functions.https.HttpsError('not-found', 'Update action not found');
    }
    const userRecord = await auth().getUser(uid);
    const name = userRecord.displayName
    switch (data.updateAction) {
        case "claim":
            if (!questionDoc.teacher_id) {
                questionDoc.teacher_id=uid;
                questionDoc.teacherName = name;
                questionDoc.answerTime = new Date();
                transaction.set(questionRef,questionDoc)
                return {response: "Success"}
            } else {
                return { response: "Already claimed" }
            }
        case "revokeClaim":
            if (questionDoc.teacher_id){
                questionDoc.teacher_id=undefined
                questionDoc.teacherName = undefined
                questionDoc.answerTime = undefined
                transaction.set(questionRef,questionDoc)
                return {response: "Success"}
            }else {
                return { response: "Not previously claimed" }
            }
        default:
            throw new functions.https.HttpsError('invalid-argument', "The updateAction is invalid");
    }
}
export { questionConverter, Question, questionRequest }