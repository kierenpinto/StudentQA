import React, { useState } from 'react';
import ButtonList from '../components/ButtonList';
import AddText from '../components/AddText';
import { connect } from 'react-redux';
import { Row, Card, Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

function EnterCodeView(props) {
    const [textField, setTextField] = useState("");
    const handleCode = (e) => {
        e.preventDefault();
        throw Error('Implement handle code action');
    }
    const textFieldChangeHandle = (e) => {
        setTextField(e.target.value);
    }
    const text = 'Join Code'
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
        </Container>
    )
}

function SubjectsView(props) {
    const dispatch = props.dispatch;
    const CreateSubjectHandle = function (subjectName) {
        // dispatch(createSubject(subjectName));
    }
    const ListItemClickHandle = (key) => {
        console.log(key)
        // dispatch(changeView(ViewTypes.GROUP));
    }
    return (
        <React.Fragment>
            <ButtonList list={[]} onClick={ListItemClickHandle}></ButtonList>
            <AddText onClick={CreateSubjectHandle} prompt="Subject Name eg. ABC1234" />
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        subjects: state.subjectList.names
    }
}

export default connect(mapStateToProps)(EnterCodeView);