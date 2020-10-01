
import firebaseApp from './firebase'
console.log("CHECKING IF IN LOCAL DEBUG",process.env)
if (process.env.REACT_APP_LOCAL_FUNCTIONS){
    firebaseApp.functions().useFunctionsEmulator("http://localhost:5001");
    console.log("IN LOCAL DEBUG");
}
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

export {createSubject as createSubjectInFirebase, renameSubject as renameSubjectInFirebase}