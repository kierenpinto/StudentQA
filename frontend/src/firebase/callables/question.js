import firebaseApp from '../firebase';

// Shared Properties:
const questionRequest = firebaseApp.functions().httpsCallable('questionRequest');

/**
 * Calls cloud function to create and therefore a start a new question in firebase(firestore)
 * @param {String} subject_id 
 * @param {String} group_id 
 */
function claimQuestion(subject_id, group_id, session_id, question_id) {
    console.log("Claiming question:", subject_id, group_id, session_id, question_id);
    const req = {
        action: 'update',
        updateAction: 'claim',
        subject_id,
        group_id,
        session_id,
        id: question_id
    }
    return questionRequest(req)
}

/**
 * Calls cloud function to end question in firebase(firestore)
 * @param {String} subject_id 
 * @param {String} group_id
 * @param {String} session_id
 * @param {String} question_id
 */
function revokeQuestionClaim(subject_id, group_id, session_id, question_id) {
    console.log("Reovking claiming for question:", subject_id, group_id, session_id, question_id);
    const req = {
        action: 'update',
        updateAction: 'revokeClaim',
        subject_id,
        group_id,
        session_id,
        id: question_id
    };
    return questionRequest(req);
}

export { claimQuestion as claimQuestionInFirebase, revokeQuestionClaim as revokeQuestionClaimInFirebase }