
/* Actions */
const ACTION_TYPES = {
    SELECT_GROUP:'SELECT_GROUP',
    UPDATE_GROUP_DOC:'UPDATE_GROUP_DOC'
}

/* Action Creators */

/**
 * Called when a group is selected
 * @param {{id:string,name:string}} 
 * groupObject Is an element in array: state.subject.subjectData.groups
 */
function selectGroup(groupObject){
    return {
        type: ACTION_TYPES.SELECT_GROUP,
        groupObject
    }
}

function updateGroupDoc(newDoc){
    return {
        type: ACTION_TYPES.UPDATE_GROUP_DOC,
        newDoc
    }
}

export {
    ACTION_TYPES,selectGroup,updateGroupDoc
}
