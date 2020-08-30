import { firestore, auth } from "firebase-admin";
import * as functions from 'firebase-functions';
import { makeRef } from "./dbRefs";


class Teacher {
    constructor(public uid: string, public subjectNames:Array<String>, public subjectRefs:Array<firestore.DocumentReference>) { }
}

const teacherConverter = {
    toFirestore(teacher: Teacher): FirebaseFirestore.DocumentData {
        return { uid: teacher.uid, subjectNames: teacher.subjectNames, subjectRefs:teacher.subjectRefs };
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Teacher {
        const data = snapshot.data();
        return new Teacher(data.uid, data.subjectNames, data.subjectRefs);
    }
};

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */
// const teacherRequest = functions.https.onCall((data,context)=>{
//     const uid = context.auth?.uid
//     context.auth?.token.firebase.sign_in_provider
//     if (!uid){
//         throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
//     }
//     switch (data.action) {
//         case 'create':
//             return create(data,uid);
//         case 'update':
//             return update(data.newName, uid);
//         default:
//             // Return an error
//             throw new functions.https.HttpsError('invalid-argument',"Invalid subject action request");
//     }
// })

// async function create(data:any, uid: string){
//     const newTeacher = new Teacher(uid, []);
//     await makeRef.teachers.withConverter(teacherConverter).doc(uid).set(newTeacher);
//     return {response:'success'}
// }

// async function update(newName:string, uid:string){
//     await 

//     return {response:'success'}
// }

// async function remove(uid:string){
//     await auth().deleteTeacher(uid);
//     await makeRef.teachers.doc(uid).delete()
//     return {response:'success'}
// }

// export {remove}