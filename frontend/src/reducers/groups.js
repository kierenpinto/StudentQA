const { ACTION_TYPES } = require("../actions/groups");

class Group {
    constructor(name,parent_id){
        this.name = name;
        this.parent_id = parent_id;
    }
}
const initialState = {
    groups:[]
}
function groupList(previousState = initialState,action){
    switch (action.type) {
        case ACTION_TYPES.CREATE_CLASSGROUP:
            const grp = new Group(action.text,action.subject_id);
            const mod = Object.assign({}, previousState, {
                groups:[...previousState.groups, grp]
            })
            return mod;
        default:
            return previousState;
    }
}

export default groupList;