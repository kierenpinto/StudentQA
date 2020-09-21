import React from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import ButtonList from '../components/ButtonList';
import { useDispatch } from 'react-redux';
import { changeView, ViewTypes } from '../actions/view';
import firebase from '../firebase/firebase';
function Home(props){
    const dispatch = useDispatch();
    const startHandle = async (key) => {
        await firebase.auth().signInAnonymously()
        dispatch(changeView(ViewTypes.STUDENT))
    }
    return (
        <Container>
            <ButtonList list={['Student - Click here to start']} onClick={startHandle}/>
        </Container>
    )
}

export default Home;