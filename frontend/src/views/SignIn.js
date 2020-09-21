import React from 'react';
import { Container } from 'react-bootstrap';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from '../firebase/firebase';

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
        firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    }
}


function SignInView(props) {
    return (
        <Container id="firebaseui-auth-container">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />
        </Container>
    )
}

export default SignInView