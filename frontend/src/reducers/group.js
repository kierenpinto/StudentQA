const { ACTION_TYPES } = require("../actions/groups");

const initialState = {
    groupObject:null,
    groupData:null,
}
function group(previousState = initialState,actions){
    switch (actions.type) {
        case ACTION_TYPES.SELECT_GROUP:
            return Object.assign({}, previousState, {
                groupObject: actions.groupObject
            })
        case ACTION_TYPES.UPDATE_GROUP_DOC:
            return Object.assign({}, previousState,{
                groupData: actions.newDoc
            })
        default:
            return previousState;
    }
}

export default group;