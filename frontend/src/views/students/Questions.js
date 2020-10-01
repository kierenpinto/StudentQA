import React, { useState } from "react"
import { Row, Card, Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import ButtonList from '../../components/ButtonList';
import { askQuestionInFirebase } from "../../firebase/callables/students";
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
    return {
        userDoc: state.user.userDoc,
        selectedSubGrp: state.student.subgroupObj,
        questions: state.student.questions.map(q=>q.question)
    }
}

export default connect(mapStateToProps)(function(props){
    const {selectedSubGrp, userDoc, questions} = props;
    const loaded = true;
    const [textField, setTextField] = useState("");
    const textFieldChangeHandle = (e) => {
        setTextField(e.target.value);
    }
    console.log("questions",questions);
    if (loaded){
        const handleCode = (e) => {
            e.preventDefault();
            // throw Error('Implement handle code action');
            // console.log("TEST",userDoc.studentSubjects, selectedSubGrp);
            if (textField.length > 0){
                askQuestionInFirebase(textField,userDoc.studentSubjects.findIndex(s=>s.docRef==selectedSubGrp.docRef)).then(out=>console.log(out))
            } else {
                const error = "Not long enough"
            }
        }
        const ListItemClickHandle = ()=>{};
        
        const text = 'Question'
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
                                        <Button variant="outline-primary" type="submit" value="Submit"> Ask </Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </form>
                        </Card.Body>
                    </Card>
                </Row>
                <Row>
                    <ButtonList list={questions} onClick={ListItemClickHandle}></ButtonList>
                </Row>
            </Container>
        )
    } else {
        return "loading"
    }
})
