import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { Button, Container, Row } from 'react-bootstrap';

function AddButton(props) {
    const handleClick = () => props.onClick();
    return (
        <Container>
            <Row className="my-sm-3">
                <Button variant="outline-primary" size="lg" block onClick={handleClick}>
                    <Icons.PlusSquareFill size={40}/>
                </Button>
            </Row>
        </Container>
    )
}

export default AddButton;
