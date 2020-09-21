import {  /* subscribeUser, */ userdocUpdate, /* unsubscribeUser, */ updateUserSubjects } from '../../actions/user'
import { firestore } from 'firebase';
import {createUserInFirebase} from '../callables/user'
const db = firestore();
export default function (store){
    let currentUser = null;
    let observer = null;
    store.subscribe(() => {
        let previousUser = currentUser
        const state = store.getState();
        currentUser = state.user.firebase;
        if (previousUser !== currentUser) {
            if (previousUser != null) {
                //store.dispatch(unsubscribeUser())
                observer()
            }
            observer = db.collection('users').doc(currentUser.uid).onSnapshot(doc => {
                if (doc.exists) {
                    const document_data = doc.data();
                    console.log(document_data)
                    store.dispatch(userdocUpdate(document_data));
                    store.dispatch(updateUserSubjects(document_data.teacherSubjects.map(sub => {
                        return { id: sub.docRef.id, ref: sub.docRef, name: sub.name }
                    })));
                } else {
                    createUserInFirebase();
                }
            })
            //store.dispatch(subscribeUser(unsubscribe_user))
        }
    })
}