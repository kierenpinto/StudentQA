import { Container, Row, Card, Button } from 'react-bootstrap';
import React from 'react';

function ButtonList(props) {
    const list = props.list;
    const output = list.map((item, index) => {
        return <ListElement key={index} index={index} content={item} onClick={props.onClick} />
    })
    return (
        <Container>
            {output}
        </Container>
    )
}

function ListElement(props) {
    const content = props.content;
    const key = props.index;
    const onClick = () => props.onClick(key);

    return (
        <Row className="my-sm-3">
            <Card className="mx-auto bg-light" style={{ width: "100%" }}>
                <Button onClick={onClick} variant="light">
                    <Card.Body><h5>{content}</h5></Card.Body>
                </Button>
            </Card>
        </Row>
    )
}

export default ButtonList;