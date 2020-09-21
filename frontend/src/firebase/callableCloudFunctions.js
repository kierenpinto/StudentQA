
import firebaseApp from './firebase'
firebaseApp.functions().useFunctionsEmulator("http://localhost:5001");
// Called by Redux Thunks!
function createSubject(name){
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqCreateSubject = {
        action: 'create',
        name
    }
    return subjectReq(reqCreateSubject)
}

/**
 * Calls cloud function to rename subject in firestore. Ensures denormalised data is in sync.
 * @param {string} subjectID Document ID of the subject
 * @param {string} newName The new name 
 */
function renameSubject(subjectID, newName){
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqRenameSubject = {
        action: 'update',
        updateAction: 'rename',
        id:subjectID,
        name: newName
    }
    return subjectReq(reqRenameSubject)
}

function test(user) {

    
    const userReq = firebaseApp.functions().httpsCallable('userRequest');
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqCreateUser = {
        action: 'create',
        userType: 'Student',
    }
    const reqRenameUser = {
        action: 'changeOwn',
        newName: 'Fancy Pants'
    }
    const response = (result) => console.log('result', result)
    // userReq(reqCreateUser).then(response)
    const reqCreateSubject = {
        action: 'create',
        name: 'ECE2598'
    }
    //subjectReq(reqCreateSubject).then(response)
}

export {createSubject as createSubjectInFirebase, renameSubject as renameSubjectInFirebase}