const { ACTION_TYPES } = require("../actions/sessions");

class Session {
    constructor(name,parent_id){
        this.name = name;
        this.parent_id = parent_id;
    }
}
const initialState = {
    sessions:[],
    active_session_id: -1
}
function sessionList(previousState = initialState,action){
    switch (action.type) {
        case ACTION_TYPES.CREATE_SESSION:
            const grp = new Session(action.text,action.class_id);
            const mod = Object.assign({}, previousState, {
                sessions:[...previousState.sessions, grp]
            })
            return mod;

        case ACTION_TYPES.SET_ACTIVE_SESSION:
            return Object.assign({}, previousState, {
                active_session_id: action.session_id
            })
        default:
            return previousState;
    }
}

export default sessionList;