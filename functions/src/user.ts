
import * as functions from 'firebase-functions';
import {makeRef} from './dbRefs'
import { auth } from "firebase-admin";

enum UserType {
    Teacher = 'Teacher',
    Student = "Student",
    Other = "Other"
}

class User {
    constructor(public uid: string, public type: UserType) { }
}

const userConverter = {
    toFirestore(user: User): FirebaseFirestore.DocumentData {
        return { uid: user.uid, type: UserType};
    },
    fromFirestore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): User {
        const data = snapshot.data();
        const findType = ()=>{
            switch (data.type) {
                case 'teacher':
                    return UserType.Teacher

                case 'student':
                    return UserType.Student
                    
                default:
                    return UserType.Other
            }
        }

        return new User(data.uid, findType());
    }
};

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */
const userRequest = functions.https.onCall((data,context)=>{
    const uid = context.auth?.uid
    context.auth?.token.firebase.sign_in_provider
    if (!uid){
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    switch (data.action) {
        case 'create':
            return create(data,uid);
        case 'changeName':
            return changeName(data.newName, uid);
        case 'delete':
            return remove(uid);
        default:
            // Return an error
            throw new functions.https.HttpsError('invalid-argument',"Invalid subject action request");
    }
})

async function create(data:any, uid: string){
    const userType  = data.userType
    const newUser = new User(uid,userType);
    await makeRef.users.withConverter(userConverter).doc(uid).set(newUser);
    return {response:'success'}
}

async function changeName(newName:string, uid:string){
    // Change Name in Google Auth
    await auth().updateUser(uid, {
        displayName: newName
    })
    // Update name in each of the subjects if a teacher, or each of the questions if a student.
    console.error("Have not implemented propagation of name update");

    return {response:'success'}
}

async function remove(uid:string){
    await auth().deleteUser(uid);
    await makeRef.users.doc(uid).delete()
    return {response:'success'}
}


export {User,userConverter, UserType, userRequest};

