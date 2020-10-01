import { firestore } from 'firebase';
import { updateStudentQDoc } from '../../actions/student';

const db = firestore();

export default function (store) {
    let stdSubObserver = null;
    let currentStdSub = null;
    let currentQuestions = null;
    store.subscribe(() => {
        const state = store.getState();
        const previous = currentStdSub;
        currentStdSub = state.student.subgroupObj;
        if (previous != currentStdSub) {
            console.log("CHANGE IN SUBJECT GROUP")
            if (currentQuestions) {
                console.log("QUESIIONS EXIST AND MUST BE DELETED/UNSUBED")
                currentQuestions.forEach((q, index) => {
                    store.dispatch(updateStudentQDoc(0, null))
                })
                currentQuestions.forEach(unsub => unsub());
            }
            if (stdSubObserver) {
                stdSubObserver() // Unsubscribe
                stdSubObserver = null;
            } else {
                stdSubObserver = null;
            }
            if (currentStdSub) {
                stdSubObserver = currentStdSub.subRef.onSnapshot(doc => {
                    const data = doc.data();
                    console.log("Latest student subject group Doc Data", data);
                    if (data) {
                        currentQuestions = data.questions.map((question, index) => {
                            return question.onSnapshot(qDoc => {
                                const qData = qDoc.data();
                                store.dispatch(updateStudentQDoc(index, qData));
                            })
                        })
                    }
                })
            }

        }
    })
}