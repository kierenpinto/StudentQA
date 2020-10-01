import React from 'react';
// import './App.css';
import {connect} from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';
import BackButton from './components/BackButton';
import { ViewTypes, previousView, changeView } from './actions/view';
import TeacherHomeView from './views/teachers';
import SubjectView from './views/teachers/Subject';
import GroupsView from './views/teachers/Groups';
import SessionView from './views/teachers/Session';
import SignIn from './views/SignIn';
import SignOutButton from './components/SignOutButton';
import firebase from './firebase/firebase';
import Home from './views/Home';
import Student from './views/students/';
import StudentQuestions from './views/students/Questions'

function App(props) {
  const dispatch = props.dispatch;
  const onBackClickHandle = ()=>{
    dispatch(previousView())
  }
  const firebase_user = props.user.firebase;
  const view = () => {
    // return <SubjectView />
    if (firebase_user){
      if (!firebase_user.isAnonymous){
        switch (props.view) {
          case ViewTypes.TEACHER:
              return (<TeacherHomeView />)
          case ViewTypes.SUBJECT:
            return <SubjectView />
          case ViewTypes.GROUP:
            return <GroupsView />
          case ViewTypes.SESSION:
            return <SessionView />
          case ViewTypes.TUTOR:
            return <React.Fragment> Have not implemented Tutor YET</React.Fragment>
          case ViewTypes.SIGNIN:
            return <SignIn />
          default:
            return (<React.Fragment>Invalid View Selected</React.Fragment>)
        } 
      } else {
        switch (props.view) {
          case ViewTypes.SIGNIN:
            return <SignIn />
          case ViewTypes.STUDENT:
            return  <Student />
          case ViewTypes.STUDENT_QUESTIONS:
            return <StudentQuestions />
          default:
            return (<React.Fragment>Invalid View Selected</React.Fragment>)
        }
      }

    } else {
        switch (props.view) {
          case ViewTypes.SIGNIN:
            return <SignIn />
          case ViewTypes.HOME:
            return <Home/>
          default:
              return (<React.Fragment>Invalid View Selected</React.Fragment>)
        }
    }
  }
  const handleSignInOut = () =>{
    if (firebase_user){
      firebase.auth().signOut();
    }else {
      dispatch(changeView(ViewTypes.SIGNIN));
    }
  }
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <BackButton onClick={onBackClickHandle} />
        <Navbar.Brand style={{'paddingLeft':'1em'}}>
          Student Q&A
        </Navbar.Brand>
        <div className="mr-auto"><Navbar.Text>
          {props.view}
        </Navbar.Text></div>
        <SignOutButton signedIn={firebase_user} onClick={handleSignInOut}/>
      </Navbar>
      {view()}
    </div>
  );
}

const mapStateToProps = state=>{
  return {
    view: state.view.selection,
    user: state.user
  }
}
export default connect(mapStateToProps)(App);
