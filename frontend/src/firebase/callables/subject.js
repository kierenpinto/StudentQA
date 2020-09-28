import firebaseApp from '../firebase';

/**
 * Calls cloud function to add teacher to subject in firestore.
 * @param {string} subjectID Document ID of the subject
 * @param {string} email The email of the teacher 
 */
function addTeacher(subjectID, email){
    console.log("Adding teacher", subjectID, email)
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const req = {
        action: 'update',
        updateAction: 'addTeacher',
        id:subjectID,
        teacher_email: email
    }
    return subjectReq(req)
}

/**
 * Calls cloud function to delete Teacher from subject in firestore.
 * @param {String} subjectID 
 * @param {String} teacher_uid 
 */
function deleteTeacher(subjectID, teacher_uid){
    console.log("Deleting teacher", subjectID, teacher_uid)
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const req = {
        action: 'update',
        updateAction: 'removeTeacher',
        id:subjectID,
        teacher_uid: teacher_uid
    }
    return subjectReq(req)
}

/**
 * Calls cloud function to delete Subject by SubjectID in firestore.
 * @param {String} subjectID 
 */
function deleteSubject(subjectID){
    console.log("Deleting subject", subjectID);
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const req = {
        action: 'delete',
        id:subjectID
    }
    return subjectReq(req)
}

export {addTeacher as addTeacherInFirebase, deleteTeacher as deleteTeacherInFirebase, deleteSubject as deleteSubjectInFirebase};