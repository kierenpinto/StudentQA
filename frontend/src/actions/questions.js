
/* Actions */
const ACTION_TYPES = {
    CREATE_QUESTION: 'CREATE_QUESTION'
}

/* Action Creators */
function createQuestion(text,group_id){
    return {
        type: ACTION_TYPES.CREATE_QUESTION,
        text,
        group_id
    }
}

export {
    ACTION_TYPES,createQuestion
}