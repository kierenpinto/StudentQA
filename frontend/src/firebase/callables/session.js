import firebaseApp from '../firebase';

// Shared Properties:
const sessionRequest = firebaseApp.functions().httpsCallable('sessionRequest');

/**
 * Calls cloud function to create and therefore a start a new session in firebase(firestore)
 * @param {String} subject_id 
 * @param {String} group_id 
 */
function createSession(subject_id,group_id){
    console.log("starting session for:", subject_id,group_id);
    const req = {
        action: 'create',
        subject_id,
        group_id
    }
    return sessionRequest(req)
}

/**
 * Calls cloud function to end session in firebase(firestore)
 * @param {String} subject_id 
 * @param {String} group_id 
 * @param {String} session_id 
 */
function endSession(subject_id,group_id,session_id){
    console.log("ending session for:",subject_id,group_id,session_id);
    const req = {
        action: 'update',
        updateAction: 'end',
        subject_id,
        group_id,
        id: session_id
    };
    return sessionRequest(req);
}

export {createSession as createSessionInFirebase, endSession as endSessionInFirebase}