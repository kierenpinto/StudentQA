import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

function BackButton(props) {
    
    const action = props.onClick;
    const handleClick = ()=> action();
    return (
        <Button variant="dark" size="sm" onClick={handleClick}>
            <Icons.ArrowLeftShort size={30}/>
        </Button>
    )
}

export default BackButton;
