import {firestore} from 'firebase';
import { updateGroupDoc } from '../../actions/groups';
const db = firestore();

export default function(store) {
    let groupObserver = null;
    let currentGroup = null;
    store.subscribe(()=>{
        const state = store.getState();
        const previousGroup = currentGroup;
        currentGroup = state.group.groupObject;

        if(previousGroup != currentGroup){
            if(groupObserver){
                groupObserver() // Unsubscribe
                groupObserver = null;
                console.log("Unsubscribed from old group");
            } else {
                groupObserver = null;
            }
            console.log("Loading new group");
            groupObserver = db.collection('subjects').doc(state.subject.userSubjectObject.id)
            .collection('classes').doc(currentGroup.id).onSnapshot(doc=>{
                const data = doc.data();
                console.log("Latest Group Doc Data", data);
                store.dispatch(updateGroupDoc(data));
            })
        }
    })
}