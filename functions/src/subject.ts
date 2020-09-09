import * as functions from 'firebase-functions';
import { makeRef, firestoreDB } from './dbRefs';
import { auth } from 'firebase-admin';
import { userConverter } from './user';
import { assertString } from './typeassertions';

type UserTuple = {
    uid:string,
    name:string|undefined,
    email:string,
}
/**
 * Subject class - shows the Subject information, including the number of user ids. 
 */
class Subject {
    public teachers: Array<UserTuple>;
    constructor(public name: string, public owner_uid: string, teachers: Array<UserTuple>) {
            this.teachers = teachers;
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
        return new Subject(data.name, data.owner_uid, data.teachers);
    }
}

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */

const subjectRequest = functions.https.onCall(async (data, context) => {
    try {
        const uid = context.auth?.uid;
        if (!uid) {
            throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
        }
        assertString(uid, 'UID');
        assertString(data.action, 'action (data.action)')
        const userRecord = await auth().getUser(uid);
        const email = userRecord.email;
        if(!email){
            throw new functions.https.HttpsError('data-loss', 'No email address found in user record - please set an email address for user');
        }
        const displayName = userRecord.displayName;

        switch (data.action) {
            case 'create':
                return create(data, uid, email, displayName);
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
async function create(data: any, uid: string, email:string, displayName:string|undefined) {
    assertString(data.name, "Subject Name")
    const sub = new Subject(<string>data.name, uid,[{uid,name:displayName, email}]);
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
        await addSubjectToTeacher(subjectID, sub.name ,transaction, uid);
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
    // console.log(updateAction)
    // console.log(subjectID);
    try {
        const subjRef = makeRef.subjects.withConverter(subjectConverter).doc(subjectID);
        await firestoreDB.runTransaction(async (trans) => {
            const sub = (await trans.get(subjRef)).data()
            if (sub?.isOwner(uid)) {
                switch (updateAction) {
                    case 'rename':
                        assertString(data.name, 'Subject Name')
                        const name = <string>data.name;
                        await renameSubject(subjectID,sub,name,trans)
                        break; // Something here
                    case 'addTeacher':
                        assertString(data.teacher_email, "Teacher Email");
                        await addTeacher(subjectID, sub, trans, <string>data.teacher_email)
                        break;
                    case 'removeTeacher':
                        assertString(data.teacher_uid, "Teacher UID");
                        await removeTeacher(subjectID, sub, trans, <string>data.teacher_uid);
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
        throw new functions.https.HttpsError("unknown", error)
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
            const teacher_uids = subject?.teachers.map(t=>t.uid);
            await removeSubjectFromUsers(subjectID,trans,teacher_uids);
            trans.delete(subjRef)
        } else {
            if (subject) {
                throw new functions.https.HttpsError('permission-denied', "Subject can only be updated by its owner");
            } else {
                throw new functions.https.HttpsError('not-found', "Subject not found");
            }
        }

    })
    return { response: 'success' }
}

/**
 * HELPER FUNCTIONS
 */

async function removeTeacher(subjectID: string, subject: Subject, transaction: FirebaseFirestore.Transaction, teacher_uid: string) {
    //Find UID
    const teacherIndex = subject.teachers.findIndex(t=>t.uid==teacher_uid)
    if(teacherIndex<0){
        throw new functions.https.HttpsError('not-found', "User entry in subject not found - cannot delete")
    }
    subject.teachers.splice(teacherIndex,1)
    // Remove subject from user object
    await removeSubjectFromUsers(subjectID,transaction,teacher_uid);
}

/**
 * Delete a 
 * @param subjectID 
 * @param transaction 
 * @param teacher_uids 
 */
async function removeSubjectFromUsers(subjectID: string,transaction: FirebaseFirestore.Transaction, teacher_uids: string | Array<string>){
    if (!Array.isArray(teacher_uids)){
        teacher_uids = [teacher_uids]
    }
    const userRefs = teacher_uids.map(id=> makeRef.users.withConverter(userConverter).doc(id))
    const users = (await transaction.getAll(...userRefs)).map(d=>d.data())
    users.forEach((user,index)=>{
        if (user) {
            const subjectIndex = user.teacherSubjects.findIndex(el=> el.id == subjectID)
            if (subjectIndex<0){
                throw new functions.https.HttpsError('not-found', "Subject entry in user not found - cannot delete")
            }
            user.teacherSubjects.splice(subjectIndex,1)// Delete subject ID from the list of subjects a user is a teacher for.
            transaction.set(userRefs[index],user);
        } else {
            throw new functions.https.HttpsError('not-found', "User entry corresponding to teacher not found");
        }
    })

}

async function addTeacher(subjectID: string, subject: Subject, transaction: FirebaseFirestore.Transaction, teacher_email: string) {
    // Look-Up Teacher Email to Find UID of Teacher
    try {
        const teacher = (await auth().getUserByEmail(teacher_email))
        const teacher_uid = teacher.uid;
        const name = teacher.displayName;
        const email = teacher.email;
        console.log("Add Teacher", email,teacher_email)
        if (!(email==teacher_email)){
            throw new functions.https.HttpsError('failed-precondition', 'Teacher email address and user email address - report to administrator')
        }
        // Check user doesn't already exist in teacher:
        if(subject.teachers.find(t=>t.uid==teacher_uid)){
            throw new functions.https.HttpsError('already-exists', 'teacher already exists in subject');
        }
        // Push UID of teacher into array
        subject.teachers.push({uid:teacher_uid, name, email:teacher_email});
        await addSubjectToTeacher(subjectID, subject.name, transaction, teacher_uid);
        
    } catch (error) {
        if (error == 'auth/user-not-found'){
            throw new functions.https.HttpsError('not-found', "Teacher not found in system");
        } else {
            throw error;
        }
    }

}

async function addSubjectToTeacher(subjectID: string, subjectName: string, transaction: FirebaseFirestore.Transaction, teacher_uid: string) {
    // Add subject to user object
    const userRef = makeRef.users.doc(teacher_uid).withConverter(userConverter)
    const user = (await transaction.get(userRef)).data()
    if (user) {
        if(user.teacherSubjects.find(t=>t.id==subjectID)){
            throw new functions.https.HttpsError('already-exists', 'subject already exists in teacher');
        }
        user.teacherSubjects.push({name: subjectName, id: subjectID}) // Add subject ID to the list of subjects a user is a teacher for.
        transaction.set(userRef, user);
    } else {
        throw new functions.https.HttpsError('not-found', "User entry corresponding to teacher not found");
    }
}

async function renameSubject(subjectID:string, subject: Subject, newSubjectName:string, transaction: FirebaseFirestore.Transaction){
    const teacher_references = subject.teachers.map(teacher_uid=>makeRef.users.doc(teacher_uid.uid).withConverter(userConverter));
    const teacherSnap = await transaction.getAll(...teacher_references);
    const teacherDocs = teacherSnap.map(snap=>snap.data());
    teacherDocs.map((teacher,teacher_index)=>{
        if (teacher){
            //console.log("Teacher", teacher, "SubjectID", subjectID)
            const subject_index = teacher.teacherSubjects.findIndex(sub=>sub.id == subjectID)
            teacher.teacherSubjects[subject_index].name = newSubjectName;
            //console.log(teacher_references[teacher_index],teacher)
            transaction.set(teacher_references[teacher_index],teacher);
        }else{
            throw new functions.https.HttpsError('not-found', "When renaming a teacher did not exist");
        }

    })
    subject.name = newSubjectName;
}
export { subjectRequest, Subject, subjectConverter };