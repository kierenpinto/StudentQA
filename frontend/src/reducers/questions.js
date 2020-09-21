const { ACTION_TYPES } = require("../actions/questions");

class Question {
    constructor(name,parent_id,text){
        this.name = name;
        this.text = text;
        this.parent_id = parent_id;
    }
    setTeacher(teacher){
        this.teacher = teacher;
    }
}

const tempInitQuestions = [1,2,3].map(x=>new Question(`Question${x}`,x,`This is a question about${x}`))
tempInitQuestions[1].setTeacher('Kieren');
const initialState = {
    questions:[...tempInitQuestions]
}
function questionList(previousState = initialState,action){
    switch (action.type) {
        case ACTION_TYPES.CREATE_QUESTION:
            const grp = new Question(action.text,action.subject_id);
            const mod = Object.assign({}, previousState, {
                questions:[...previousState.questions, grp]
            })
            return mod;
        default:
            return previousState;
    }
}

export default questionList;