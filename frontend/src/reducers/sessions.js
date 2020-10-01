const { ACTION_TYPES } = require("../actions/sessions");

const initialState = {
    sessionData:null,
    sessionObject: null,
    questionList: null
}
function sessionList(previousState = initialState,action){
    switch (action.type) {
        case ACTION_TYPES.UPDATE_SESSION_DOC:
            const mod = Object.assign({}, previousState, {
                sessionData:action.newDoc
            })
            return mod;

        case ACTION_TYPES.SELECT_SESSION:
            return Object.assign({}, previousState, {
                sessionObject: action.session_id
            })
        case ACTION_TYPES.UPDATE_QUESTION_DOCS:
            return Object.assign({},previousState,{
                questionList: action.newDocs
            })
        default:
            return previousState;
    }
}

export default sessionList;