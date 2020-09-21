const { CHANGE_AUTHSTATE, SUBSCRIBE_USER, UNSUBSCRIBE_USER, USERDOC_UPDATE, UPDATE_USER_SUBJECTS } = require("../actions/user");

const initialState = {firebase:false,firestoreObserver:null, userDoc: null, subjects:[], /* subject_names:[] */};
function reduceUserChange(previous = initialState, action) {
    switch (action.type) {
        case CHANGE_AUTHSTATE:
            return Object.assign({}, previous, {firebase: action.user});

        case SUBSCRIBE_USER:
            if (previous.firestoreObserver == null){
                return Object.assign({},previous, {firestoreObserver: action.firestoreObserver})
            }
            return previous

        case UNSUBSCRIBE_USER:
            if (previous.firestoreObserver != null){
                previous.firestoreObserver();
                return Object.assign({}, previous, {firestoreObserver: null})
            }
            throw new Error('Unsubscribing a non-existent firestore Observer')
        case USERDOC_UPDATE:
            return Object.assign({}, previous, {userDoc: action.userDoc})
        case UPDATE_USER_SUBJECTS:
            return Object.assign({}, previous, {
                subjects: action.list,
            })
        default:
            return previous
    }
}

export default reduceUserChange;