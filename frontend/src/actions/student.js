/**
 * Actions
 */
const ACTION_TYPES = {
    SELECT_STUDENT_SUB_GRP: 'SELECT_STUDENT_SUB_GRP',
    UPDATE_STUDENT_QUESTION_DOC: 'UPDATE_STUDENT_QUESTION_DOC',
    UPDATE_STUDENT_GROUP_DOC: 'UPDATE_STUDENT_GROUP_DOC'
}


/* Action Creators */
function selectStudentGroup(subGrpObj){
    return {
        type: ACTION_TYPES.SELECT_STUDENT_SUB_GRP,
        subGrpObj
    }
}

function updateStudentQDoc(index, newDoc){
    return {
        type: ACTION_TYPES.UPDATE_STUDENT_QUESTION_DOC,
        index,
        newDoc,
    }
}

function updateStudentGroupDoc(newDoc){
    return {
        type: ACTION_TYPES.UPDATE_STUDENT_GROUP_DOC,
        newDoc
    }
}


export {ACTION_TYPES, selectStudentGroup, updateStudentQDoc, updateStudentGroupDoc}