import { Container, Row, Card } from 'react-bootstrap';
import React from 'react';

function ListView({ list, ...props }) {
    if (Array.isArray(list)){
        const output = list.map((item, index) => {
            const childProps = {
                key: index, item, ...props
            }
            return <ListElement {...childProps} />
        })
        return (
            <Container>
                {output}
            </Container>
        )
    }
    else{
        return (
            <Container>
                Loading ...
            </Container>
        )
    }

}

function ListElement(props) {
    const { children, ...others } = props;
    const {item, ...leftOvers} = others;
    const newProps = {...item,...leftOvers};
    const elm = React.createElement(children, newProps)
    return (
        <Row className="my-sm-3">
            <Card className="mx-auto bg-light" style={{ width: "100%" }}>
                    {elm}
            </Card>
        </Row>
    )
}

export default ListView;