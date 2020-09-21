import React, { useState } from 'react';
import * as Icons from 'react-bootstrap-icons';
import { Button, Container, Row, FormControl, InputGroup, Card, Alert } from 'react-bootstrap';

function AddText(props) {
    const [visibleTB, setTBVisibility] = useState(false);
    const [textField, setTextField] = useState("");
    const [warning, setWarn] = useState(false);
    const showTB = () => setTBVisibility(true)
    const hideTB = () => {
        setTBVisibility(false);
        setWarn(false); 
        setTextField("");
    };
    const textFieldChangeHandle = (e) => {
        setTextField(e.target.value);
    }
    const textPrompt = props.prompt;
    const handleClick = (e) => {
        if (textField.length > 3) {
            const promise = props.onClick(textField);
            if (Promise.resolve(promise) == promise ){
                promise.then(response=>{
                    console.log(response)
                    hideTB();
                    setTextField("");
                    setWarn(false);
                })
            }else {
                hideTB();
                setTextField("");
                setWarn(false);
            }            
        } 
        else {
            setWarn("Name must be greater than 3 characters")
        }
        e.preventDefault();
    };
    const content = function(){
        if (visibleTB) {
            return (
                <Card style={{ width: "100%" }}>
                    <Card.Body>
                        <form onSubmit={handleClick}>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button variant="outline-primary" type="button" onClick={hideTB}><Icons.X size={20} /></Button>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder={textPrompt}
                                    aria-label={textPrompt}
                                    value={textField}
                                    onChange={textFieldChangeHandle}
                                />
                                <InputGroup.Append>
                                    <Button variant="outline-primary" type="submit" value="Submit"><Icons.Check size={20} /></Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </form>
                    </Card.Body>
                </Card>
            )
        } else {
            return (
                <Row className="my-sm-3">
                    <Button variant="outline-primary" size="lg" block onClick={showTB}>
                        <Icons.PlusSquareFill size={40} />
                    </Button>
                </Row>
            )
        }
    }()


    return (
        <Container>
            {content}
            {warning && <Alert variant='warning'>{warning}</Alert>}
        </Container>
    )
}

export default AddText;
