const { ACTION_TYPES } = require("../actions/student");

const initialState = {
    subgroupObj: null,
    subgroupDoc: null,
    questions: []
}
function sessionList(previousState = initialState,action){
    switch (action.type) {
        case ACTION_TYPES.UPDATE_STUDENT_QUESTION_DOC:
            const qs = previousState.questions;
            qs[action.index] = action.newDoc
            const mod = Object.assign({}, previousState, {
                questions:qs
            })
            return mod;

        case ACTION_TYPES.SELECT_STUDENT_SUB_GRP:
            return Object.assign({}, previousState, {
                subgroupObj: action.subGrpObj
            })

        case ACTION_TYPES.UPDATE_STUDENT_GROUP_DOC:
            return Object.assign({}, previousState, {
                subgroupDoc: action.newDoc
            })
        default:
            return previousState;
    }
}

export default sessionList;