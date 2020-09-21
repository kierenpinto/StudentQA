import firebaseApp from '../firebase'
/**
 * Creates a user in firebase
 * @returns Promise
 */
function createUser(){
    const userReq = firebaseApp.functions().httpsCallable('userRequest');
    const reqCreateUser = {
        action: 'create',
        userType: 'Student',
    }
    return userReq(reqCreateUser)
}
export { createUser as createUserInFirebase }