
import { firestore } from 'firebase';
import { updateSubjectDoc } from '../../actions/subjects';
const db = firestore();

export default function (store){
    let subjectObserver = null; // Stores the subject observer;
    let currentSubject = null;
    store.subscribe(() => {
        const state = store.getState();
        let previousSubject = currentSubject;
        currentSubject = state.subject.userSubjectObject;
        // let observer = subjectObserver;
        if (previousSubject != currentSubject) {
                        if(subjectObserver){
                subjectObserver() // Unsubscribe
                subjectObserver = null;
                console.log("Unsubscribed from old subject");
            } else {
                subjectObserver = null;
            }
            console.log("Loading new subject");
            subjectObserver = db.collection('subjects').doc(currentSubject.id).onSnapshot(doc=>{
                    const data = doc.data();
                    console.log("Latest Subject Doc Data",data)
                    store.dispatch(updateSubjectDoc(data))
                })
        }
    })
}