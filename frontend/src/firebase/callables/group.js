import firebaseApp from '../firebase';

// Shared Properties:
const groupRequest = firebaseApp.functions().httpsCallable('groupRequest');

/**
 * Calls cloud function to add group to subject in firebase(firestore).
 * @param {string} subjectID Document ID of the subject
 * @param {string} groupName The name of the group
 */
function createGroup(subjectID, groupName){
    console.log("adding group", subjectID, groupName)
    const req = {
        action: 'create',
        name:groupName,
        subject_id:subjectID
    }
    return groupRequest(req)
}

/**
 * Calls cloud function to deletes group from subject in firebase(firestore).
 * @param {String} subjectID Document ID of the subject
 * @param {String} groupID Document ID of the group
 */
function deleteGroup(subjectID, groupID){
    console.log("Deleting group", subjectID, groupID)
    const req = {
        action: 'remove',
        updateAction: 'removeTeacher',
        id:subjectID,
        teacher_uid: groupID
    }
    return groupRequest(req)
}

export {createGroup as createGroupInFirebase, deleteGroup as deleteGroupInFirebase};