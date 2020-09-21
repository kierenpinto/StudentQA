import React from 'react';
import { connect } from 'react-redux';
import { createQuestion } from '../../actions/questions';
import { Button,  Card } from 'react-bootstrap';
import ListView from '../../components/List';


function QuestionViewItem(props) {
    const name = props.name;
    const id = props.id;
    const text = props.text; // Text of the question
    //const claimed = props.claimed; // If the question has been claimed or not;
    const onClaimQuestion = () => props.onClaimQuestion(id);
    const onUnclaimQuesiton = () => props.onRevokeClaim(id);
    const teacher = props.teacher || false; // Name of teacher attending to the student 
    if (teacher) {

    }
    return (
        <Card.Body>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="px-2" style={{ minWidth: 'fit-content' }}>{name} : {text}</div>
                <div style={{ width: '100%' }} />
                {teacher &&
                    <React.Fragment>
                        <div className="px-2" style={{ minWidth: 'fit-content' }}>
                            Assigned to {teacher}
                        </div>
                        <div className="px-2" style={{ minWidth: 'fit-content' }}>
                            <Button variant="secondary"> Revoke Claim Question </Button>
                        </div >
                    </React.Fragment>
                }

                {!teacher &&
                    <div style={{ minWidth: 'fit-content' }}>
                        <Button variant="danger"> Claim Question </Button>
                    </div>
                }
            </div>
        </Card.Body>
    )
}

function SessionView(props) {
    const dispatch = props.dispatch;
    const ItemList = props.questions.map((grp) => grp.name);
    const CreateQuestionHandle = function (questionName) {
        dispatch(createQuestion(questionName, 1));
    }
    return (
        <React.Fragment>
            <ListView list={props.questions} >{QuestionViewItem}</ListView>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        questions: state.questionList.questions
    }
}

export default connect(mapStateToProps)(SessionView);