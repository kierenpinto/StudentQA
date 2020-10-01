
/* Actions */
const ACTION_TYPES = {
    SELECT_SESSION: 'SELECT_SESSION',
    UPDATE_SESSION_DOC: 'UPDATE_SESSION_DOC',
    UPDATE_QUESTION_DOCS: 'UPDATE_QUESTION_DOCS'
}

/* Action Creators */
function selectSession(session_id){
    return {
        type: ACTION_TYPES.SELECT_SESSION,
        session_id
    }
}

/**
 * 
 * @param {firestore.DocumentData} newDoc 
 */
function updateSessionDoc(newDoc){
    return {
        type: ACTION_TYPES.UPDATE_SESSION_DOC,
        newDoc
    }
}

/**
 * 
 * @param {firestore.DocumentData[]} newDocs 
 */
function updateQuestionDocs(newDocs){
    return {
        type: ACTION_TYPES.UPDATE_QUESTION_DOCS,
        newDocs
    }
}

export {
    ACTION_TYPES,selectSession, updateSessionDoc, updateQuestionDocs
}