import React from 'react';
import ButtonList from '../../components/ButtonList';
import AddText from '../../components/AddText';
import { connect } from 'react-redux';
import { createSubject, selectSubject } from '../../actions/subjects';
import { changeView, ViewTypes } from '../../actions/view';
import { Container, Row, Col } from 'react-bootstrap';

function TeacherHomeView(props) {
    const {dispatch, subjects} = props
    const subject_names = subjects.map(sub=>sub.name);
    const CreateSubjectHandle = function (subjectName) {
        dispatch(createSubject(subjectName));
    }
    const ListItemClickHandle = (key) => {
        console.log("Clicked subject no: ",key)
        dispatch(changeView(ViewTypes.SUBJECT));
        const selectedSubject = subjects[key];
        dispatch(selectSubject(selectedSubject));
    }
    /* 
        This is the Teacher Home View.
        It contains a list of subjects that the teacher is part of or owns. It will also contain a configuration button for the teacher to configure their profile.
        The teacher should be able to add subjects from here.
        Subject creation should use a redux thunk to call the firebase onCallable Method.
     */
    return (
        <React.Fragment>
            <Container className="pt-3 ">
                <Row className="justify-content-md-center">
                    <Col className="text-center">
                        <h3>Subjects</h3>
                    </Col>
                </Row>
            </Container>
            <div className="border">
            <ButtonList list={subject_names} onClick={ListItemClickHandle}></ButtonList>
            <AddText onClick={CreateSubjectHandle} prompt="Subject Name eg. ABC1234" />
            <Container>
                    {subject_names.length == 0 &&
                        <Row className="pt-1">
                            <div className="alert alert-primary mx-auto" /* style={{width:'100%'}} */ role="alert">It looks like you don't have any subjects yet. Click + to create one.</div>
                        </Row>
                    }
                </Container>
            </div>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        subjects: state.user.subjects
    }
}

export default connect(mapStateToProps)(TeacherHomeView);
