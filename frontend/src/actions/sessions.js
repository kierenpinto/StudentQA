
/* Actions */
const ACTION_TYPES = {
    CREATE_SESSION: 'CREATE_SESSION',
    SET_ACTIVE_SESSION: 'SET_ACTIVE_SESSION'
}

/* Action Creators */
function createSession(text,class_id){
    return {
        type: ACTION_TYPES.CREATE_SESSION,
        text,
        class_id
    }
}

function setActiveSession(session_id){
    return {
        type: ACTION_TYPES.SET_ACTIVE_SESSION,
        session_id
    }
}


export {
    ACTION_TYPES,createSession, setActiveSession
}