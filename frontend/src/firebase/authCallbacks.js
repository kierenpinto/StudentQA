import firebaseApp from './firebase'
import { changeAuth } from '../actions/user'
import { changeView, ViewTypes } from '../actions/view';

function authCallbacks(store) {
    // firebaseApp.auth().signInAnonymously();
    firebaseApp.auth().onAuthStateChanged(
        (user) => {
            // console.log(user.displayName);
            store.dispatch(changeAuth(user));
            if (user) {
                test(user)
                if (!user.isAnonymous) store.dispatch(changeView(ViewTypes.TEACHER))
                else store.dispatch(changeView(ViewTypes.STUDENT))
            } else {
                store.dispatch(changeView(ViewTypes.HOME))
            }
        }
    )
}

function test(user) {
    console.log('User', user);

    firebaseApp.functions().useFunctionsEmulator("http://localhost:5001");
    const userReq = firebaseApp.functions().httpsCallable('userRequest');
    const subjectReq = firebaseApp.functions().httpsCallable('subjectRequest');
    const reqCreateUser = {
        action: 'create',
        userType: 'Student',
    }
    const reqRenameUser = {
        action: 'changeOwn',
        newName: 'Fancy Pants'
    }
    const response = (result) => console.log('result', result)
    // userReq(reqCreateUser).then(response)
    const reqCreateSubject = {
        action: 'create',
        name: 'ECE2598'
    }
    //subjectReq(reqCreateSubject).then(response)
}

export default authCallbacks