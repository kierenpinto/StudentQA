import {combineReducers} from 'redux';
import {firestoreReducer} from 'redux-firestore';
import view from './view';
import subject from './subject'
import session from './sessions'
import questionList from './questions'
import user from './user'
import group from './group'
import student from './student'
const mainReducer = combineReducers({
    view,
    subject: subject,
    group,
    session,
    questionList,
    user,
    student,
    firestore: firestoreReducer
})

export default mainReducer;