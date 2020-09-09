
import * as functions from 'firebase-functions';
import { makeRef } from './dbRefs'
import { auth, firestore } from "firebase-admin";

import { assertString } from './typeassertions';

enum UserType {
    Teacher = 'Teacher',
    Student = "Student",
    Other = "Other"
}

function assertUserType(obj: UserType) {
    if (!(obj in UserType)) {
        throw new TypeError("UserType is not Valid");
    }
}

type NameIdPair = {
    name:string
    id:string
}

type FireStoreNameIdPair = {
    name:string
    docRef:firestore.DocumentReference<firestore.DocumentData>
}

function assertNameIdPair(obj: NameIdPair,txt:string){
    if (!("name" in obj && "id" in obj)){
        throw new TypeError("NameIdPair is not valid in "+ txt);
    }
}

class User {
    // type: UserType
    constructor(public uid: string, public type: UserType, public teacherSubjects: Array<NameIdPair>, public studentSubjects: Array<NameIdPair>) {
        assertUserType(type);
        assertString(uid), 'UID';
        teacherSubjects.map(s => assertNameIdPair(s, 'teacherSubjectsID'));
        studentSubjects.map(s => assertNameIdPair(s, 'studentSubjectsID'));
    }
    isTeacher() {
        return this.type == UserType.Teacher;
    }
    isStudent() {
        return this.type == UserType.Student;
    }
}


const userConverter = {
    toFirestore(user: User): FirebaseFirestore.DocumentData {
        const teacherSubjects = user.teacherSubjects.map((sub):FireStoreNameIdPair => {return{name:sub.name, docRef:makeRef.subjects.doc(sub.id)}});
        const studentSubjects = user.studentSubjects.map((sub):FireStoreNameIdPair => {return{name:sub.name, docRef:makeRef.subjects.doc(sub.id)}});
        return { uid: user.uid, type: user.type, teacherSubjects, studentSubjects };
    },
    fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
        // console.log(snapshot)
        const data = snapshot.data();
        const findType = () => {
            switch (data.type) {
                case 'teacher':
                    return UserType.Teacher

                case 'student':
                    return UserType.Student

                default:
                    return UserType.Other
            }
        }
        const teacherSubjects = (<FireStoreNameIdPair[]>data.teacherSubjects).map((sub):NameIdPair => {return{name:sub.name, id:sub.docRef.id}});
        
        const studentSubjects = (<FireStoreNameIdPair[]>data.studentSubjects).map((sub):NameIdPair => {return{name:sub.name, id:sub.docRef.id}});
        return new User(data.uid, findType(), teacherSubjects, studentSubjects);
    }
};

/**
 * This function handles create update and delete actions. Reads are done directly from firestore by the client.
 */
const userRequest = functions.https.onCall((data, context) => {
    const uid = context.auth?.uid
    context.auth?.token.firebase.sign_in_provider
    if (!uid) {
        throw new functions.https.HttpsError('permission-denied', "Request has not been authenticated");
    }
    switch (data.action) {
        case 'create':
            return create(data, uid);
        case 'changeName':
            return changeName(data.newName, uid);
        case 'delete':
            return remove(uid);
        default:
            // Return an error
            throw new functions.https.HttpsError('invalid-argument', "Invalid subject action request");
    }
})

async function create(data: any, uid: string) {
    try {
        const userType = data.userType
        const newUser = new User(uid, userType, [], []);
        const ref = makeRef.users.withConverter(userConverter).doc(uid)
        if ((await ref.get()).exists) {
            throw new functions.https.HttpsError('already-exists', ' This user already exists in the database')
        }
        await makeRef.users.withConverter(userConverter).doc(uid).set(newUser);
        return { response: 'success' }
    } catch (error) {
        if (error instanceof TypeError) {
            throw new functions.https.HttpsError('invalid-argument', error.name + ' ' + error.message)
        } else {
            throw error;
        }
    }
}

async function changeName(newName: string, uid: string) {
    try {
        // Change Name in Google Auth
        assertString(newName, "Name UserID");
        await auth().updateUser(uid, {
            displayName: newName
        })
        // Update name in each of the subjects if a teacher, or each of the questions if a student.
        console.error("Have not implemented propagation of name update");

        return { response: 'success' }
    } catch (error) {
        if (error instanceof TypeError) {
            throw new functions.https.HttpsError('invalid-argument', error.name + ' ' + error.message)
        } else {
            throw error;
        }
    }

}

async function remove(uid: string) {
    await auth().deleteUser(uid);
    await makeRef.users.doc(uid).delete()
    // Propagate deletion of user through all subjects.
    return { response: 'success' }
}


export { User, userConverter, UserType, userRequest };

