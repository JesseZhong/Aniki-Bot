import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './Dialog.sass';


const Dialog = (props: {
    title: JSX.Element | string,
    body: JSX.Element | string,
    onConfirm: () => void,
    onCancel: () => void,
    confirmButton?: string,
    cancelButton?: string,
    className?: string
}) => (
    <Modal
        show={true}
        onHide={props.onCancel}
        className={props.className}
        centered
    >
        <Modal.Header>
            <Modal.Title>
                {props.title}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.body}
        </Modal.Body>
        <Modal.Footer>
            <Button
                variant='danger'
                onClick={props.onConfirm}
            >
                {props.confirmButton ?? 'Yes'}
            </Button>
            <Button
                variant='secondary'
                onClick={props.onCancel}
            >
                {props.cancelButton ?? 'No'}
            </Button>
        </Modal.Footer>
    </Modal>
)

export default Dialog;