import {combineReducers} from 'redux';
import {firestoreReducer} from 'redux-firestore';
import view from './view';
import subject from './subject'
import session from './sessions'
import questionList from './questions'
import user from './user'
import group from './group'
const mainReducer = combineReducers({
    view,
    subject: subject,
    group,
    session,
    questionList,
    user,
    firestore: firestoreReducer
})

export default mainReducer;