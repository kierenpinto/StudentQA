import { CHANGE_VIEW,ViewTypes, PREVIOUS_VIEW } from "../actions/view";


const initialState = {
    selection: ViewTypes.HOME // Change back to HOME
}

function previousViewReduce(previousState){
    switch (previousState.selection) {
        case ViewTypes.QUESTION:
            return ViewTypes.SESSION
        case ViewTypes.SESSION:
            return ViewTypes.GROUP
        case ViewTypes.GROUP:
            return ViewTypes.SUBJECT
        case ViewTypes.SUBJECT:
            return ViewTypes.TEACHER;
        case ViewTypes.TEACHER:
            return ViewTypes.TEACHER;
        case ViewTypes.SIGNIN:
            return ViewTypes.HOME;
        default:
            return previousState.selection;
    }
}
function view(previousState = initialState,action){
    switch (action.type) {
        case CHANGE_VIEW:
            return Object.assign({}, previousState, {
                selection:action.view
            })
        case PREVIOUS_VIEW:
            return Object.assign({}, previousState, {
                selection: previousViewReduce(previousState)
            })
        default:
            return previousState;
    }
}

export default view;