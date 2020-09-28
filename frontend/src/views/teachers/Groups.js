import React from 'react';
import ListView from '../../components/List';
// import AddText from '../components/AddText';
import { connect, useDispatch } from 'react-redux';
import { ViewTypes, changeView } from '../../actions/view';
import { Button, Container, Row, Card, InputGroup, Col } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { createSessionInFirebase, endSessionInFirebase } from '../../firebase/callables/session';

function StartSession(props) {
    const dispatch = useDispatch();
    const enabled = props.enabled; // disabled when a session is active. (only one session at a time)
    const groupID = props.groupID;
    const subjectID = props.subjectID;
    const CreateSessionHandle = function () {
        //REPLACE WITH AUTO DATE NAMING (PUT IN ACTION CREATOR)
        // dispatch(createSession(Date(), 1));
        createSessionInFirebase(subjectID, groupID)
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
    const start = props.start.toDate().toString();
    let end;
    if (props.end) {
        end = props.end.toDate().toString();
    }
    const id = props.id;
    const onClick = () => props.onClick(id);
    const onEnd = () => props.onEnd(id);

    return (
        <Card.Body>
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text style={{ 'flexGrow': '1' }}>{start}</InputGroup.Text>
                    <InputGroup.Text style={{ 'flexGrow': '1' }}>{end}</InputGroup.Text>
                </InputGroup.Prepend>
                <span className="mx-auto" />
                <InputGroup.Append>
                    {/* <Button variant="secondary"> Edit </Button> */}
                    {!end &&
                        <Button onClick={onEnd} variant="danger"> End Session </Button>
                    }
                </InputGroup.Append>
            </InputGroup>
        </Card.Body>
    )
}

function SessionsView(props) {
    const { dispatch, subject, group } = props;
    const name = `${subject.subjectData.name}  ${group.groupData.name}`;
    const groupName = group.groupData.name;
    const sessions = group.groupData.sessions;
    const groupID = group.groupObject.id;
    const subjectID = subject.userSubjectObject.id;
    const ListItemClickHandle = (key) => {
        console.log(key)
        dispatch(changeView(ViewTypes.QUESTION));
    }
    const EndSessionClickHandle = (key) => {
        endSessionInFirebase(subjectID, groupID, key)
    }
    return (
        <React.Fragment>
            <Container className="pt-3">
                <Row className="justify-content-md-center">
                    <Col className="text-center">
                        <h3>{name}</h3>
                    </Col>
                </Row>
            </Container>
            <div className="border">
                <Container className="pt-3 ">
                    <Row>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h3><small className="text-muted">Classes</small> </h3>
                        </div>
                    </Row>
                    <Row>
                        <h6> All your sessions for the {groupName} group are displayed here:</h6>
                    </Row>
                </Container>
                <StartSession groupID={groupID} subjectID={subjectID} />
                <ListView list={sessions} onEnd={EndSessionClickHandle} onClick={ListItemClickHandle}>{SessionViewItem}</ListView>
            </div>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        subject: state.subject,
        group: state.group
    }
}

export default connect(mapStateToProps)(SessionsView);