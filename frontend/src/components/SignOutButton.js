import React from 'react';
import { Button } from 'react-bootstrap';

function SignOutButton(props){
    const signedIn = props.signedIn;
    return (
        <Button variant="dark" onClick={props.onClick}>
            {signedIn ? "Sign Out" : "Tutor Sign In"}
        </Button>
    )
}

export default SignOutButton