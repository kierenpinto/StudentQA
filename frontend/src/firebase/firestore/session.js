import {firestore} from 'firebase';
import {updateSessionDoc} from '../../actions/sessions';
const db = firestore();

export default function(store){
    let sessionObserver = null;
    let currentSession = null;
    store.subscribe(()=>{
        const state = store.getState();
        const previousSession = currentSession;
        currentSession = state.session.sessionObject;
        if(previousSession != currentSession){
            if(sessionObserver){
                sessionObserver() // Unsubscribe
                sessionObserver = null;
                console.log("Unsubscribed from old session");
            } else {
                sessionObserver = null;
            }
            console.log("Loading new session");
            sessionObserver = db.collection('subjects').doc(state.subject.userSubjectObject.id)
            .collection('classes').doc(state.group.groupObject.id).collection('sessions').doc(currentSession).onSnapshot(doc=>{
                const data = doc.data();
                console.log("Latest Session Doc Data", data);
                store.dispatch(updateSessionDoc(data));
            })
        }
    })
}