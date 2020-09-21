import React from 'react';
import * as Icons from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

function EditButton(props) {
    
    const action = props.onClick;
    const handleClick = ()=> action();
    return (
        <Button variant="outline-secondary" size="sm" onClick={handleClick}>
            <Icons.Pencil size={10}/>
        </Button>
    )
}

export default EditButton;
