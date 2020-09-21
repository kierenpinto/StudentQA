
const CHANGE_AUTHSTATE = 'CHANGE_AUTHSTATE'
const SUBSCRIBE_USER = 'SUBSCRIBE_USER'
const UNSUBSCRIBE_USER = 'UNSUBSCRIBE_USER'
const USERDOC_UPDATE = 'USERDOC_UPDATE'
const UPDATE_USER_SUBJECTS = 'UPDATE_USER_SUBJECTS'

function changeAuth(user) {
    return {
        type: CHANGE_AUTHSTATE,
        user
    }
}

function subscribeUser(firestoreObserver) {
    return {
        type: SUBSCRIBE_USER,
        firestoreObserver
    }
}

function unsubscribeUser() {
    return {
        type: UNSUBSCRIBE_USER
    }
}

function userdocUpdate(newDoc) {
    return {
        type: USERDOC_UPDATE,
        userDoc: newDoc,
    }
}

function updateUserSubjects(list){
    return {
        type: UPDATE_USER_SUBJECTS,
        list
    }
}
export { CHANGE_AUTHSTATE, changeAuth, SUBSCRIBE_USER, subscribeUser, UNSUBSCRIBE_USER, unsubscribeUser, USERDOC_UPDATE, userdocUpdate, UPDATE_USER_SUBJECTS, updateUserSubjects }