import * as functions from 'firebase-functions';
import { firestoreDB, makeRef } from './dbRefs'
import { subjectGroupConverter } from './group';
import { questionConverter, Question } from './question';
import { assertString } from './typeassertions';

import { userConverter } from "./user";
// import { StudentSession } from './user';

/**
 * Use the firebase document name to as concat of subject_id + group_id
 */
class StudentQuestions {
    // constructor(public session:StudentSession, questions:Array<String> = []){}
    constructor(public questions: Array<FirebaseFirestore.DocumentReference<Question>>) { }
}

const studentQuestionsConverter = {
    toFirestore(sq: StudentQuestions): FirebaseFirestore.DocumentData {
        return {...sq}
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot) {
        const data = snapshot.data();
        // const session = <StudentSession>data.session;
        const questions = <Array<FirebaseFirestore.DocumentReference<Question>>>data.questions;
        // return new StudentQuestions(session, questions);
        return new StudentQuestions(questions||[])
    }
}

type joinSubjectData = {
    join_code: string
}

const joinSubject = functions.https.onCall(async (data: joinSubjectData, context) => {
    const uid = context.auth?.uid;
    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    assertString(data.join_code, "Join Code") // Check join code is string
    const join_code = data.join_code;
    const groupRef = makeRef.classCollectionGroup.withConverter(subjectGroupConverter).where('join_code', '==', join_code);

    return firestoreDB.runTransaction(async (transaction) => {
        const groups = await transaction.get(groupRef)
        if (groups.size > 1) {
            throw new functions.https.HttpsError('out-of-range', "More than one group found corresponding to join code. Contact administrator.");
        }
        if (groups.size < 1) {
            throw new functions.https.HttpsError('not-found', "Join Code does not correspond to any known group")
        }
        const group = groups.docs[0]
        // console.log("Split path",group.ref.path.split("/"))
        const subject_id = group.ref.path.split("/")[1];
        const group_id = group.id;
        const groupData = group.data();
        const userRef = makeRef.users.withConverter(userConverter).doc(uid)
        const userDoc = (await transaction.get(userRef)).data()
        if (!userDoc) {
            throw new functions.https.HttpsError('not-found', "User document not found. Contact administrator")
        }
        // Check if this subjectGroup has already been added
        if (userDoc.studentSubjects.find(x => x.group_id === group_id && x.subject_id === subject_id)) {
            return { response: 'subject already added' }
        } else {
            console.log(`Subject: ${subject_id}, Group: ${group_id}`)
            userDoc.studentSubjects.push({ subject_id: subject_id, group_id: group_id, name: groupData.name })
            transaction.set(userRef, userDoc);
            return { response: 'success' }
        }
    })
})


type QuestionReqData = {
    // group_id?:String
    // subject_id?:String
    subject_index: number
    question: string
}

const askQuestion = functions.https.onCall((data: QuestionReqData, context) => {
    const uid = context.auth?.uid;

    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    return firestoreDB.runTransaction(async trans => {
        const usrRef = makeRef.users.doc(uid).withConverter(userConverter)
        const userDoc = (await trans.get(usrRef)).data()
        if (!userDoc) {
            throw new functions.https.HttpsError('not-found', "User document not found. Contact administrator")
        }
        if (userDoc.studentSubjects.length < data.subject_index) {
            throw new functions.https.HttpsError("out-of-range", "subjectIndex exceeds range");
        }
        const subjectGroup = userDoc.studentSubjects[data.subject_index]

        const groupRef = makeRef.classGroups(subjectGroup.subject_id).doc(subjectGroup.group_id).withConverter(subjectGroupConverter);
        const groupData = (await trans.get(groupRef)).data()
        if (!groupData) { throw new functions.https.HttpsError("not-found", "Group not found") }
        if (groupData.sessions.length === 0) {
            return { response: 'No active session' }
        }
        const session = groupData.sessions.slice().reverse()[0] // latest session
        if (session.end) {
            return { response: 'No active session' }
        }
        const session_id = session.id;
        const questionRef = makeRef.questions(session_id, subjectGroup.group_id, subjectGroup.subject_id).withConverter(questionConverter).doc();
        const name = "TEST STUDENT"
        const question = new Question(name, data.question, new Date());
        const studentQuestionID = subjectGroup.subject_id + subjectGroup.group_id
        const userSGRef = makeRef.userStudentGroup(uid).doc(studentQuestionID).withConverter(studentQuestionsConverter);
        const SG = (await trans.get(userSGRef)).data()
        const studentQuestions = SG ? SG : new StudentQuestions([])
        studentQuestions.questions.push(questionRef)
        trans.set(userSGRef, studentQuestions);
        trans.set(questionRef, question);
        return { response: 'success' }
    })
})

export { joinSubject, askQuestion }