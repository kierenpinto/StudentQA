import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import { createQuestion } from '../../actions/questions';
import { Button, Card } from 'react-bootstrap';
import ListView from '../../components/List';
import { claimQuestionInFirebase, revokeQuestionClaimInFirebase } from '../../firebase/callables/question';


function QuestionViewItem(props) {
    const { name, id, text, uid, teacher_id, teacherName } = props;

    const onClaimQuestion = () => props.onClaimQuestion(id);
    const onUnclaimQuesiton = () => props.onRevokeClaim(id);
    return (
        <Card.Body>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="px-2" style={{ minWidth: 'fit-content' }}>{name} : {text}</div>
                <div style={{ width: '100%' }} />
                {teacher_id &&
                    <React.Fragment>
                        <div className="px-2" style={{ minWidth: 'fit-content' }}>
                            Assigned to {teacherName}
                        </div>
                        {teacher_id == uid &&
                            <div className="px-2" style={{ minWidth: 'fit-content' }}>
                                <Button variant="secondary" onClick={onUnclaimQuesiton}> Revoke Claim Question </Button>
                            </div >
                        }
                    </React.Fragment>
                }

                {!teacher_id &&
                    <div style={{ minWidth: 'fit-content' }}>
                        <Button variant="primary" onClick={onClaimQuestion}> Claim Question </Button>
                    </div>
                }
            </div>
        </Card.Body>
    )
}

function SessionView(props) {
    const { uid, subject_id, group_id, session_id } = props;
    const onClaimQuestion = (id)=>claimQuestionInFirebase(subject_id,group_id,session_id,id).then(out=>console.log(out))
    const onRevokeClaim = (id)=>revokeQuestionClaimInFirebase(subject_id,group_id,session_id,id).then(out=>console.log(out))
    return (
        <React.Fragment>
            <ListView list={props.questions} onClaimQuestion={onClaimQuestion} onRevokeClaim={onRevokeClaim} uid={uid}>{QuestionViewItem}</ListView>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    const ql = state.session.questionList
    return {
        questions: ql ? ql.map(q => { return { ...q, text: q.question } }) : [],
        uid: state.user.firebase ? state.user.firebase.uid : null,
        subject_id: state.subject.userSubjectObject ? state.subject.userSubjectObject.id : null,
        group_id: state.group.groupObject ? state.group.groupObject.id : null,
        session_id: state.session.sessionObject
    }
}

export default connect(mapStateToProps)(SessionView);