import React from 'react';
import ListView from '../../components/List';
// import AddText from '../components/AddText';
import { connect, useDispatch } from 'react-redux';
import { createSession } from '../../actions/sessions';
import { ViewTypes, changeView } from '../../actions/view';
import { Button, Container, Row, Card, InputGroup } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';

function StartSession(props) {
    const dispatch = useDispatch();
    const enabled = props.enabled; // disabled when a session is active. (only one session at a time)
    const CreateSessionHandle = function () {
        //REPLACE WITH AUTO DATE NAMING (PUT IN ACTION CREATOR)
        dispatch(createSession(Date(), 1));
    }
    return (
        <Container>
            <Row className="my-sm-3">
                <Button variant="outline-primary" size="lg" block onClick={CreateSessionHandle}>
                    <Icons.PlusSquareFill size={40} />
                </Button>
            </Row>
        </Container>
    )
}


function SessionViewItem(props) {
    const name = props.name;
    const id = props.id;
    const onClick = () => props.onClick(id);
    const onEdit = () => props.onEdit(id);
    
    return (
        <Card.Body>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text style={{ 'flexGrow': '1' }}>{name}</InputGroup.Text>
                </InputGroup.Prepend>
                <span className="mx-auto" />
                <InputGroup.Append>
                    <Button variant="secondary"> Edit </Button>
                    <Button variant="danger"> End Session </Button>
                </InputGroup.Append>
            </InputGroup>
        </Card.Body>
    )
}

function SessionsView(props) {
    const dispatch = props.dispatch;
    const ListItemClickHandle = (key) => {
        console.log(key)
        dispatch(changeView(ViewTypes.QUESTION));
    }
    return (
        <React.Fragment>
            <StartSession />
            <ListView list={props.sessions} onClick={ListItemClickHandle}>{SessionViewItem}</ListView>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        sessions: state.sessionList.sessions
    }
}

export default connect(mapStateToProps)(SessionsView);