import * as functions from 'firebase-functions';
import { makeRef, firestoreDB } from './dbRefs';
import { auth } from 'firebase-admin';
import { userConverter } from './user';
import { assertString } from './typeassertions';
/**
 * Subject class - shows the Subject information, including the number of user ids. 
 */
class Subject {
    public teachers_uids: Array<string>;
    constructor(public name: string, public owner_uid: string, teachers_uids?: Array<string>) {
        //Ensure that teacher_uids are present.
        if (!teachers_uids) {
            this.teachers_uids = [owner_uid];
        } else {
            this.teachers_uids = teachers_uids;
        }
    }
    isOwner(uid: string) {
        return this.owner_uid == uid;
    }
}

const subjectConverter = {
    toFirestore(subject: Subject): FirebaseFirestore.DocumentData {
        return { ...subject }
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Subject {
        const data = snapshot.data();
        return new Subject(data.name, data.owner_uid, data.teacher_uids);
    }
}

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */

const subjectRequest = functions.https.onCall((data, context) => {
    try {
        const uid = context.auth?.uid;
        if (!uid) {
            throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
        }
        assertString(uid, 'UID');
        assertString(data.action, 'action (data.action)')
        switch (data.action) {
            case 'create':
                return create(data, uid);
            case 'update':
                return update(data, uid);
            case 'delete':
                return remove(data, uid);

            default:
                // Return an error
                // return {error:'Invalid Subject Request'}
                throw new functions.https.HttpsError('invalid-argument', "Invalid subject action request");
        }
    } catch (error) {
        if (error instanceof TypeError) {
            throw new functions.https.HttpsError('invalid-argument', error.name + ' error.message')
        } else {
            throw new functions.https.HttpsError('unknown',error);
        }
    }

})

/**
 * ACTIONS
 */


/**
 * Create a new subject
 * @param data 
 * @param uid 
 */
async function create(data: any, uid: string) {
    assertString(data.name, "Subject Name")
    const sub = new Subject(<string>data.name, uid);
    const subject = await makeRef.subjects.withConverter(subjectConverter).add(sub);
    const subjectID = subject.id;
    // console.log("subject ID", subjectID);
    // const userRef = makeRef.users.withConverter(userConverter).doc(uid)
    // const user = (await userRef.get()).data()
    // if (user) {
    //     user.teacherSubjects.push(subjectID) // Add subject ID to the list of subjects a user is a teacher for.
    //     userRef.set(user);
    // } else {
    //     throw new functions.https.HttpsError('not-found', "User entry corresponding to teacher not found");
    // }
    return await firestoreDB.runTransaction(async (transaction)=> {
        await addSubjectToTeacher(subjectID, transaction, uid);
        return { response: 'success' }
    })

}

/**
 * Update subject
 * @param data 
 * @param uid 
 */
async function update(data: any, uid: string) {
    assertString(data.updateAction, "updateAction")
    assertString(data.id, "Subject ID")
    const updateAction = <string>data.updateAction;
    const subjectID = <string>data.id;
    try {
        const subjRef = makeRef.subjects.withConverter(subjectConverter).doc(subjectID);
        await firestoreDB.runTransaction(async (trans) => {
            const sub = (await trans.get(subjRef)).data()
            if (sub?.isOwner(uid)) {
                switch (updateAction) {
                    case 'rename':
                        assertString(data.name, 'Subject Name')
                        sub.name = <string>data.name;
                        break; // Something here
                    case 'addTeacher':
                        assertString(data.teacher_email, "Teacher Email");
                        addTeacher(subjectID, sub, trans, <string>data.teacher_email)
                        break;
                    case 'removeTeacher':
                        assertString(data.teacher_uid, "Teacher UID");
                        removeTeacher(subjectID, sub, trans, <string>data.teacher_uid);
                        break //something here
                    default:
                        console.error("Invalid update action");
                        throw new functions.https.HttpsError('invalid-argument', "The updateAction is invalid");
                }
                //write to firestore
                trans.set(subjRef, sub)
            } else {
                if (sub) {
                    throw new functions.https.HttpsError('permission-denied', "Subject can only be updated by its owner");
                } else {
                    throw new functions.https.HttpsError('not-found', "Subject not found");
                }
                //return {error: "Cannot update because this is not the owner"}
            }
        });
        return { response: 'success' }
    } catch (error) {
        return { error }
    }

}

/**
 * Delete(Remove) a subject
 * @param data 
 * @param uid 
 */
async function remove(data: any, uid: string) {
    assertString(data.id, "Subject ID")
    const subjectID = <string>data.id;
    const subjRef = makeRef.subjects.withConverter(subjectConverter).doc(subjectID);
    await firestoreDB.runTransaction(async (trans) => {
        const subject = (await trans.get(subjRef)).data();
        if (subject?.isOwner(uid)) {

        } else {
            if (subject) {
                throw new functions.https.HttpsError('permission-denied', "Subject can only be updated by its owner");
            } else {
                throw new functions.https.HttpsError('not-found', "Subject not found");
            }
        }
        subject?.teachers_uids
    })
    return { response: 'success' }
}

/**
 * HELPER FUNCTIONS
 */

async function removeTeacher(subjectID: string, subject: Subject, transaction: FirebaseFirestore.Transaction, teacher_uid: string,) {
    //Find UID
    subject.teachers_uids.splice(subject.teachers_uids.indexOf(teacher_uid, 1))
    // Add subject to user object
    const user = (await transaction.get(makeRef.users.withConverter(userConverter).doc(teacher_uid))).data()
    if (user) {
        user.teacherSubjects.push(subjectID) // Add subject ID to the list of subjects a user is a teacher for.
    } else {
        throw new functions.https.HttpsError('not-found', "User entry corresponding to teacher not found");
    }
    return subject;
}

async function addTeacher(subjectID: string, subject: Subject, transaction: FirebaseFirestore.Transaction, teacher_email: string) {
    // Look-Up Teacher Email to Find UID of Teacher
    const teacher_uid = (await auth().getUserByEmail(teacher_email)).uid
    // Push UID of teacher into array
    subject.teachers_uids.push(teacher_uid)
    await addSubjectToTeacher(subjectID, transaction, teacher_uid);
}

async function addSubjectToTeacher(subjectID: string, transaction: FirebaseFirestore.Transaction, teacher_uid: string) {
    // Add subject to user object
    const userRef = makeRef.users.doc(teacher_uid).withConverter(userConverter)
    const user = (await transaction.get(userRef)).data()
    if (user) {
        user.teacherSubjects.push(subjectID) // Add subject ID to the list of subjects a user is a teacher for.
        transaction.set(userRef, user);
    } else {
        throw new functions.https.HttpsError('not-found', "User entry corresponding to teacher not found");
    }
}

export { subjectRequest, Subject, subjectConverter };