import {firestore} from 'firebase';
import { updateStudentQDoc } from '../../actions/student';

const db = firestore();

export default function(store){
    let stdSubObserver = null;
    let currentStdSub = null;
    let currentQuestions = null;
    store.subscribe(()=>{
        const state = store.getState();
        const previous = currentStdSub;
        currentStdSub = state.student.subgroupObj;
        if(previous != currentStdSub){
            if(stdSubObserver){
                stdSubObserver() // Unsubscribe
                stdSubObserver = null;
            } else {
                stdSubObserver = null;
            }
            if (currentStdSub){
                stdSubObserver = currentStdSub.subRef.onSnapshot(doc=>{
                    const data = doc.data();
                    console.log("Latest student subject group Doc Data", data);
                    if(currentQuestions){
                        currentQuestions.forEach(unsub=>unsub());
                    }
                    if(data){
                        data.questions.forEach((question,index)=>{
                            question.onSnapshot(qDoc=>{
                                const qData = qDoc.data();
                                store.dispatch(updateStudentQDoc(index,qData));
                            })
                        })
                        currentQuestions = data.questions;
                    }                    
                })
            }

        }
    })
}