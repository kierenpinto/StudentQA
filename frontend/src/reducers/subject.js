import { ACTION_TYPES } from "../actions/subjects";

const initialState = {
    userSubjectObject:null,
    subjectData: {},
    subjectAddStatus: null
}


function subjectReducer(previousState = initialState,actions){
    switch (actions.type) {
        case ACTION_TYPES.CREATE_SUBJECT_STATUS:
            const mod = Object.assign({}, previousState, {
                subjectAddStatus:actions.status
            })
            
            return mod;

        case ACTION_TYPES.SELECT_SUBJECT:
            return Object.assign({}, previousState, {
                userSubjectObject: actions.userSubjectObject
            })

        case ACTION_TYPES.UPDATE_SUBJECT_DOC:
            return Object.assign({}, previousState, {
                subjectData: actions.newDoc,
            })
        default:
            return previousState;
    }
}

export default subjectReducer;