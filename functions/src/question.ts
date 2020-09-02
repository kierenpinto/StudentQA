/**
 * Question Class - Stores information about a question being asked by a student
 */
class Question {
    /**
     * Constructor
     * @param id Question ID in Database
     * @param name Name of group asking question
     * @param question Question text
     * @param askTime Timestamp that the question was asked
     * @param teacher_id ID of teacher that responds to the question
     * @param answerTime Timestamp when the question was answered
     */
    constructor(public id: string, public name:string, public question:string, public askTime:Date,public teacher_id?:string, public answerTime?:Date){}
    /**
     * answerQuestion
     */
    public answerQuestion(teacher_id:string) {
        this.answerTime = new Date();
        this.teacher_id = teacher_id;
    }
}

const questionConverter = {
    toFirestore(question:Question): FirebaseFirestore.DocumentData {
        const askTime = FirebaseFirestore.Timestamp.fromDate(question.askTime)
        let answerTime;
        if (question.answerTime){
            answerTime = FirebaseFirestore.Timestamp.fromDate(question.answerTime);   
        }
        return {...question, answerTime, askTime}
    },
    fromFireStore(
        snapshot: FirebaseFirestore.QueryDocumentSnapshot
    ): Question {
        const data = snapshot.data();
        const answerTime = <FirebaseFirestore.Timestamp|undefined> data.answerTime;
        const askTime = <FirebaseFirestore.Timestamp> data.askTime;
        return new Question(data.id,data.name,data.question,askTime.toDate(), data.teacher_id ,answerTime?.toDate());
    }
}

