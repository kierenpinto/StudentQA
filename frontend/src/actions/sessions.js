
/* Actions */
const ACTION_TYPES = {
    SELECT_SESSION: 'SELECT_SESSION',
    UPDATE_SESSION_DOC: 'UPDATE_SESSION_DOC'
}

/* Action Creators */
function selectSession(session_id){
    return {
        type: ACTION_TYPES.SELECT_SESSION,
        session_id
    }
}

function updateSessionDoc(newDoc){
    return {
        type: ACTION_TYPES.UPDATE_SESSION_DOC,
        newDoc
    }
}


export {
    ACTION_TYPES,selectSession, updateSessionDoc
}