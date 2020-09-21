import {createSubjectInFirebase, renameSubjectInFirebase}  from '../firebase/callableCloudFunctions'
/* Actions */
const ACTION_TYPES = {
    CREATE_SUBJECT_STATUS: 'CREATE_SUBJECT_STATUS',
    RENAME_SUBJECT_STATUS:'RENAME_SUBJECT_STATUS',
    SUBSCRIBE_SUBJECT: 'SUBSCRIBE_SUBJECT',
    UNSUBSCRIBE_SUBJECT: 'UNSUBSCRIBE_SUBJECT',
    DELETE_SUBJECT :'DELETE_SUBJECT',
    UPDATE_SUBJECT_DOC : 'UPDATE_SUBJECT_DOC',
    SELECT_SUBJECT : 'SELECT_SUBJECT'
}

/* Action Creators */
function setSubjectStatus(status){
    return {
        type: ACTION_TYPES.CREATE_SUBJECT_STATUS,
        status
    }
}

function setRenameSubjectStatus(status){
    return{
        type: ACTION_TYPES.RENAME_SUBJECT_STATUS,
        status
    }
}

/**
 * Called when a subject is selected
 * @param {*} userSubjectObject Is an element in array: state.user.subjects
 */
function selectSubject(userSubjectObject){
    return {
        type: ACTION_TYPES.SELECT_SUBJECT,
        userSubjectObject
    }
}

/**
 * 
 * @param {*} observer Observer
 */
function subscribeSubject(observer){
    console.log('subscribe action', observer)
    return {
        type: ACTION_TYPES.SUBSCRIBE_SUBJECT,
        observer
    }
}

function unsubscribeSubject(){
    return {
        type: ACTION_TYPES.UNSUBSCRIBE_SUBJECT
    }
}

function updateSubjectDoc(newDoc){
    return {
        type: ACTION_TYPES.UPDATE_SUBJECT_DOC,
        newDoc
    }
}

/* Thunks */
function createSubject(name){
    return (dispatch) =>{
        dispatch(setSubjectStatus('waiting'))
        createSubjectInFirebase(name).then(response=>{
            console.log(response)
            if (response.data.response == 'success'){
                dispatch(setSubjectStatus('success'))
            } else {
                dispatch(setSubjectStatus('failed'))
            }
        })
    }
}

/**
 * Rename the Subject - Works but is deprecated
 * @param {*} subjectID :String
 * @param {*} newName :String
 */
function renameSubject(subjectID, newName){
    return (dispatch) =>{
        dispatch(setRenameSubjectStatus('waiting'))
        renameSubjectInFirebase(subjectID, newName).then(response=>{
            if(response.data.response == 'success'){
                dispatch(setRenameSubjectStatus('success'))
            }else {
                dispatch(setRenameSubjectStatus('failed'))
            }
        })
    }
}

export {
    ACTION_TYPES,createSubject, subscribeSubject,unsubscribeSubject, renameSubject,updateSubjectDoc, selectSubject
}