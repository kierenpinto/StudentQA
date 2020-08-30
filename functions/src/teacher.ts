import { firestore, auth } from "firebase-admin";
import * as functions from 'firebase-functions';
import { makeRef } from "./dbRefs";


class Teacher {
    constructor(public uid: string, public subjectRefs:Array<string>) { }
}

const teacherConverter = {
    toFirestore(teacher: Teacher): FirebaseFirestore.DocumentData {
        const refs = teacher.subjectRefs.map(ref => makeRef.teachers.doc(ref));
        return { uid: teacher.uid, subjectRefs: refs};
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Teacher {
        const data = snapshot.data();
        const subjectRefs = (<firestore.DocumentReference<firestore.DocumentData>[]> data.subjectRefs).map(ref=>ref.id);
        return new Teacher(data.uid, subjectRefs);
    }
};

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */
const teacherRequest = functions.https.onCall((data,context)=>{
    const uid = context.auth?.uid
    context.auth?.token.firebase.sign_in_provider
    if (!uid){
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    switch (data.action) {
        case 'create':
            return create(data,uid);
        // case 'update':
        //     return update(data, uid);
        default:
            // Return an error
            throw new functions.https.HttpsError('invalid-argument',"Invalid teacher action request");
    }
})

async function create(data:any, uid: string){
    const newTeacher = new Teacher(uid, []);
    await makeRef.teachers.withConverter(teacherConverter).doc(uid).set(newTeacher);
    return {response:'success'}
}

// Implement in SUBJECT File

/* async function update(data:any, uid:string){
    data.updateAction
    
    switch (data.updateAction){
        case 'addSubject':
            return addSubject(data.subjectID,uid);
        case 'deleteSubject':
            return deleteSubject(data.subjectID,uid);
        default:
            throw new functions.https.HttpsError('invalid-argument',"Invalid teacher update action request");
    }
}

async function addSubject(subjectID:string, uid:string){
    makeRef.teachers.doc
    return {response:'success'}
}

async function deleteSubject(subjectID:string, uid:string){
    return {response:'success'}
} */

async function remove(uid:string){
    await makeRef.teachers.doc(uid).delete()
    return {response:'success'}
}

export {remove}