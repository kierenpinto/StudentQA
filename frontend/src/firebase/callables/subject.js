import firebaseApp from '../firebase';

/**
 * Calls cloud function to rename subject in firestore. Ensures denormalised data is in sync.
 * @param {string} subjectID Document ID of the subject
 * @param {string} email The email of the teacher 
 */
function addTeacher(subjectID, email){
    console.log("Adding teacher", subjectID, email)
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqRenameSubject = {
        action: 'update',
        updateAction: 'addTeacher',
        id:subjectID,
        teacher_email: email
    }
    return subjectReq(reqRenameSubject)
}

/**
 * Deletes Teacher from subject
 * @param {String} subjectID 
 * @param {String} teacher_uid 
 */
function deleteTeacher(subjectID, teacher_uid){
    console.log("Deleting teacher", subjectID, teacher_uid)
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqRenameSubject = {
        action: 'update',
        updateAction: 'removeTeacher',
        id:subjectID,
        teacher_uid: teacher_uid
    }
    return subjectReq(reqRenameSubject)
}

function deleteSubject(subjectID){
    console.log("Deleting subject", subjectID);
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqRenameSubject = {
        action: 'delete',
        id:subjectID
    }
    return subjectReq(reqRenameSubject)
}

export {addTeacher as addTeacherInFirebase, deleteTeacher as deleteTeacherInFirebase, deleteSubject as deleteSubjectInFirebase};