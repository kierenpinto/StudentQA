
/* Actions */
const ACTION_TYPES = {
    CREATE_CLASSGROUP: 'CREATE_CLASSGROUP',
    LIST_CLASSGROUP:'LIST_CLASSGROUP'
}

/* Action Creators */
function createClassGroup(text,subject_id){
    return {
        type: ACTION_TYPES.CREATE_CLASSGROUP,
        text,
        subject_id
    }
}

function listClassGroup(){
    // Lists all the Groups within a subject
    // Triggered by firebase
}

export {
    ACTION_TYPES,createClassGroup
}