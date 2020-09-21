import {combineReducers} from 'redux';
import {firestoreReducer} from 'redux-firestore';
import view from './view';
import subject from './subject'
import groupList from './groups'
import sessionList from './sessions'
import questionList from './questions'
import reduceUser from './user'
const mainReducer = combineReducers({
    view,
    subject: subject,
    groupList,
    sessionList,
    questionList,
    user: reduceUser,
    firestore: firestoreReducer
})

export default mainReducer;