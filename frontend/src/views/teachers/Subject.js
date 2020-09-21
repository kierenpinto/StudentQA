import React, { useState } from 'react';
import ButtonList from '../../components/ButtonList';
import AddText from '../../components/AddText';
import { connect, useDispatch } from 'react-redux';
import { createClassGroup } from '../../actions/groups';
import { ViewTypes, changeView } from '../../actions/view';
import { Container, Row, Col, Modal, Button, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import * as Icons from 'react-bootstrap-icons';
import EditButton from '../../components/EditButton';
import { renameSubjectInFirebase } from '../../firebase/callableCloudFunctions';
import ListView from '../../components/List';
import { addTeacherInFirebase, deleteTeacherInFirebase, deleteSubjectInFirebase } from '../../firebase/callables/subject';

function EditSubjectNameModal({ handleClose, show, currentName, subjectID }) {
    const dispatch = useDispatch();
    const [textField, setTextField] = useState("");
    const textFieldChangeHandle = (e) => {
        setTextField(e.target.value);
    }
    const handleSubmit = (e) => {
        console.log("Renaming Subject:", subjectID, textField)
        renameSubjectInFirebase(subjectID, textField).then(() => handleClose())
        e.preventDefault();
    }
    const handleDeleteSubject = () => deleteSubjectInFirebase(subjectID).then(() => {
        dispatch(changeView(ViewTypes.TEACHER));
    });
    const textPrompt = `Rename ${currentName}`
    return (
        <React.Fragment>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> Configure Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <InputGroup>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleDeleteSubject}>Delete {currentName}</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    )
}
function SubjectTeacherItem(props) {
    const { isAdmin, adminUID, name, email, uid, subjectID } = props;
    const [loading, setLoading] = useState(false);
    const deleteUser = (e) => {
        console.log("delete user", uid);
        setLoading(true)
        deleteTeacherInFirebase(subjectID, uid).then(() => {
            //setLoading(false);
        })
    }
    return (
        <React.Fragment>
            {name} - {email}
            {isAdmin && adminUID != uid &&
                <Button onClick={deleteUser}>
                    Delete
                </Button>
            }
            {loading &&
                <Spinner animation="grow" variant="dark" />
            }

        </React.Fragment>
    )
}
function SubjectView(props) {
    const { dispatch, subject, user } = props
    const [renameModal, setRenameModal] = useState(false);
    const handleOpenRenameModal = () => setRenameModal(true)
    const handleCloseRenameModal = () => setRenameModal(false)
    if (!subject) {
        // If subject data hasn't loaded yet
        return (
            <Spinner animation="grow" variant="dark" />
        )
    }
    const name = subject.subjectData.name;
    const subjectID = subject.userSubjectObject.id;
    const ItemList = props.classgroups.map((grp) => grp.name);
    const teacherList = subject.subjectData.teachers;
    const isAdmin = subject.subjectData.owner_uid == user.firebase.uid;

    const CreateClassGroupHandle = (classgroupName)=> {
        dispatch(createClassGroup(classgroupName, 1));
    }

    const AddTeacherHandle = (teacherEmail) => {
        // Add teacher email
        console.log("Add teacher by email", teacherEmail)
        return addTeacherInFirebase(subjectID, teacherEmail);
    }

    const ListItemClickHandle = (key) => {
        console.log(key)
        dispatch(changeView(ViewTypes.SESSION));
    }
    return (
        <React.Fragment>
            <Container className="pt-3 ">
                <Row className="justify-content-md-center">
                    <Col className="text-center">
                        <h3>{name}
                            {isAdmin &&
                                <React.Fragment>
                                    <EditButton onClick={handleOpenRenameModal} />
                                    <EditSubjectNameModal
                                        handleClose={handleCloseRenameModal}
                                        show={renameModal}
                                        currentName={name}
                                        subjectID={subjectID} />
                                </React.Fragment>
                            }
                        </h3>
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
                        <h6> All your classes for the subject are displayed here:</h6>
                    </Row>
                </Container>
                <ButtonList list={ItemList} onClick={ListItemClickHandle}></ButtonList>
                <AddText onClick={CreateClassGroupHandle} prompt="Class Name eg. Tuesday 9am" />
                <Container>
                    {ItemList.length == 0 &&
                        <Row className="pt-1">
                            <div className="alert alert-primary mx-auto" role="alert">It looks like you don't have classes any yet. Click add (+) to create one.</div>
                        </Row>
                    }
                </Container>
            </div>
            <div className="border">
                <Container className="pt-3 ">
                    <Row>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h3><small className="text-muted">Teachers</small> </h3>
                        </div>
                    </Row>
                    <Row>
                        <h6> All teachers for the subject are displayed here:</h6>
                    </Row>
                </Container>
                <ListView list={teacherList} subjectID={subjectID} isAdmin={isAdmin} adminUID={subject.subjectData.owner_uid}>{SubjectTeacherItem}</ListView>
                {isAdmin &&
                    <React.Fragment>
                        <AddText onClick={AddTeacherHandle} prompt="firstname.lastname@monash.edu" />
                        <Container>
                            {teacherList.length < 2 &&
                                <Row className="pt-1">
                                    <div className="alert alert-primary mx-auto" role="alert">It looks like you haven't added any other teachers yet. Click add (+) to add one.</div>
                                </Row>
                            }
                        </Container>
                    </React.Fragment>
                }

            </div>
        </React.Fragment>
    )
}
const mapStateToProps = (state) => {
    return {
        classgroups: state.subject.groupNames,
        subject: state.subject,
        user: state.user
    }
}

export default connect(mapStateToProps)(SubjectView);