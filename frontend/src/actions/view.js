/* Actions */
const CHANGE_VIEW = 'CHANGE_VIEW';
const PREVIOUS_VIEW = 'PREVIOUS_VIEW'
/* View Constants */
const ViewTypes = {
    TEACHER:'TEACHER',
    SUBJECT:'SUBJECT',
    GROUP:'GROUP',
    SESSION:'SESSION',
    QUESTION:'QUESTION',
    SIGNIN:'SIGNIN',
    STUDENT:'STUDENT',
    HOME:'HOME',
    STUDENT_QUESTIONS: 'STUDENT_QUESTIONS'
}


/* Action Creators */

/**
 * 
 * @param {ViewTypes} view Must be a valid view type
 */
function changeView(view){
    return {
        type: CHANGE_VIEW,
        view
    }
}

function previousView(){
    return{
        type: PREVIOUS_VIEW
    }
}

export {
    ViewTypes, CHANGE_VIEW,changeView, PREVIOUS_VIEW, previousView
}