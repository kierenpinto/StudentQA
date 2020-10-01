import {firestore} from 'firebase';
import {updateQuestionDocs, updateSessionDoc} from '../../actions/sessions';
const db = firestore();

export default function(store){
    let sessionObserver = null;
    let questionObserver = null;
    let currentSession = null;
    store.subscribe(()=>{
        const state = store.getState();
        const previousSession = currentSession;
        currentSession = state.session.sessionObject;
        if(previousSession != currentSession){
            if(sessionObserver){
                sessionObserver() // Unsubscribe
                questionObserver();
                sessionObserver = null;
                questionObserver = null;
                console.log("Unsubscribed from old session");
            } else {
                sessionObserver = null;
                questionObserver = null;
            }
            console.log("Loading new session");
            sessionObserver = db.collection('subjects').doc(state.subject.userSubjectObject.id)
            .collection('classes').doc(state.group.groupObject.id).collection('sessions').doc(currentSession).onSnapshot(doc=>{
                const data = doc.data();
                console.log("Latest Session Doc Data", data);
                store.dispatch(updateSessionDoc(data));
            })
            questionObserver = db.collection('subjects').doc(state.subject.userSubjectObject.id)
            .collection('classes').doc(state.group.groupObject.id).collection('sessions').doc(currentSession).collection('questions').orderBy("askTime",'desc').limit(5).onSnapshot(qDocsSS=>{
                const qDocs = qDocsSS.docs;
                const newData = qDocs.map(d=>{return {...d.data(), id:d.id, dbRef:d.ref}})
                store.dispatch(updateQuestionDocs(newData))
            })
        }
    })
}