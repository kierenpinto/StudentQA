import firebaseApp from '../firebase';
/**
 * Calls cloud function to use Join Code to join subject group in firestore.
 * @param {string} join_code Document ID of the subject
 */
function joinSubjectGroup(join_code){
    console.log("Joining Subject with code:", join_code)
    const subjectReq = firebaseApp.functions().httpsCallable('joinSubject');
    const req = {
        join_code
    }
    return subjectReq(req)
}

function askQuestion(question,subject_index){
    console.log("Asking question:", question,subject_index)
    const subjectReq = firebaseApp.functions().httpsCallable('askQuestion');
    const req = {
        question,
        subject_index
    }
    return subjectReq(req)
}

export {joinSubjectGroup as joinSubjectGroupInFirebase, askQuestion as askQuestionInFirebase}