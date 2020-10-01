import React from 'react';
import ListView from '../../components/List';
import { connect } from 'react-redux';
import { ViewTypes, changeView } from '../../actions/view';
import { Button, Container, Row, Card, InputGroup, Col } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import { createSessionInFirebase, endSessionInFirebase } from '../../firebase/callables/session';
import { selectSession } from '../../actions/sessions';

function StartSession(props) {
    const groupID = props.groupID;
    const subjectID = props.subjectID;
    const CreateSessionHandle = function () {
        createSessionInFirebase(subjectID, groupID)
    }
    return (
        <Container>
            <Row className="my-sm-3">
                <Button variant="outline-primary" size="lg" block onClick={CreateSessionHandle}>
                    <Icons.Play size={40} />
                    Start Session
                </Button>
            </Row>
        </Container>
    )
}


function SessionViewItem(props) {
    const start = props.start.toDate().toLocaleString();
    let end;
    if (props.end) {
        end = props.end.toDate().toLocaleString();
    }
    const id = props.id;
    const onView = () => props.onView(id);
    const onEnd = () => props.onEnd(id);

    return (
        <Card.Body>
            <InputGroup>
                <Button variant="secondary" onClick={onView}> View </Button>
                <InputGroup.Prepend>
                    <InputGroup.Text style={{ 'flexGrow': '1' }}>Session Began: {start}</InputGroup.Text>
                    {end && <InputGroup.Text style={{ 'flexGrow': '1' }}>Session Ended: {end}</InputGroup.Text>}
                </InputGroup.Prepend>
                <span className="mx-auto" />
                <InputGroup.Append>
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
    if (group.groupData) {
        const name = `${subject.subjectData.name}  ${group.groupData.name}`;
        const groupName = group.groupData.name;
        const sessions = group.groupData.sessions.slice().reverse(); // Reversing this list here! - use slice to make immutable
        const groupID = group.groupObject.id;
        const subjectID = subject.userSubjectObject.id;
        const joinCode = group.groupData.join_code;
        const ViewItemClickHandle = (session_id) => {
            console.log("clicked session id: " + session_id);
            dispatch(selectSession(session_id));
            dispatch(changeView(ViewTypes.SESSION));
        }
        const EndSessionClickHandle = (key) => {
            endSessionInFirebase(subjectID, groupID, key)
        }
        const inProgress = sessions.length>0 ? sessions[0].end: false;
        return (
            <React.Fragment>
                <Container className="pt-3">
                    <Row className="justify-content-md-center">
                        <Col className="text-center">
                            <h3>{name}</h3>
                        </Col>
                    </Row>
                </Container>
                <div className="border-top">
                    <Container className="pt-3">
                        <Row className="justify-content-md-center">
                            <Col className="text-center">
                                <span><h6>Join Code: <mark>
                                    <strong>{joinCode}</strong>
                                </mark></h6></span>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="border">
                    <Container className="pt-3 ">
                        <Row>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <h3><small className="text-muted">Sessions</small> </h3>
                            </div>
                        </Row>
                        <Row>
                            <h6> All your sessions for the {groupName} group are displayed here:</h6>
                        </Row>
                    </Container>
                    {/* Make sure that a session isn't already in progress. */}
                    {!inProgress && <StartSession groupID={groupID} subjectID={subjectID} />}
                    <ListView list={sessions} onEnd={EndSessionClickHandle} onView={ViewItemClickHandle}>{SessionViewItem}</ListView>
                </div>
            </React.Fragment>
        )
    } else {
        return <React.Fragment></React.Fragment>
    }

}
const mapStateToProps = (state) => {
    return {
        subject: state.subject,
        group: state.group
    }
}

export default connect(mapStateToProps)(SessionsView);