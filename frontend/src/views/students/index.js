import React, { useState } from 'react';
import ButtonList from '../../components/ButtonList';
import { connect, useDispatch } from 'react-redux';
import { Row, Card, Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { joinSubjectGroupInFirebase } from '../../firebase/callables/students';
import { changeView, ViewTypes } from '../../actions/view';
import { selectStudentGroup } from '../../actions/student';

function StudentSubjects(props) {
    const [textField, setTextField] = useState("");
    const {userDoc} = props;
    const dispatch = useDispatch();
    const handleCode = (e) => {
        e.preventDefault();
        // throw Error('Implement handle code action');
        joinSubjectGroupInFirebase(textField).then(out=>console.log(out))
    }
    const textFieldChangeHandle = (e) => {
        setTextField(e.target.value);
    }
    const ListItemClickHandle = (key) => {
        dispatch(selectStudentGroup(userDoc.studentSubjects[key]))
        dispatch(changeView(ViewTypes.STUDENT_QUESTIONS))
        console.log(key)
    }
    const text = 'Join Code'
    if (userDoc) {
        const studentSubjects = userDoc.studentSubjects;
        const subjectNames = studentSubjects.map(s=>s.name);
        return (
            <Container>
                <Row className="my-sm-3">
                    <Card className="mx-auto" style={{ width: "100%" }}>
                        <Card.Body>
                            <form onSubmit={handleCode}>
                                <InputGroup>
                                    <FormControl
                                        placeholder={text}
                                        aria-label={text}
                                        value={textField}
                                        onChange={textFieldChangeHandle}
                                    />
                                    <InputGroup.Append>
                                        <Button variant="outline-primary" type="submit" value="Submit"> Join </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </form>
                        </Card.Body>
                    </Card>
                </Row>
                <Row>
                    <ButtonList list={subjectNames} onClick={ListItemClickHandle}></ButtonList>
                </Row>
            </Container>
        )
    } else {
        return "loading"
    }
    
}
const mapStateToProps = (state) => {
    return {
        userDoc: state.user.userDoc
    }
}

export default connect(mapStateToProps)(StudentSubjects);