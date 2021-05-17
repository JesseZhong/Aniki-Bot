import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import './Dialog.sass';

const Dialog = (props: {
    id: string,
    title: string,
    body: JSX.Element,
    onConfirm: () => void,
    confirmButton?: string,
    cancelButton?: string,
    className?: string
}) => (
    <div
        id={props.id}
        className={
            'modal fade ' +
            (props.className ? ` ${props.className}` : '')
        }
        tabIndex={-1}
        role='dialog'
        aria-hidden='true'
    >
        <div className='modal-dialog modal-dialog-centered show' role='document'>
            <div className='modal-content bg-light'>
                <div className='modal-header bg-secondary'>
                    <h5 className='modal-title text-dark'>
                        {props.title}
                    </h5>
                    <button
                        type='button'
                        className='btn text-dark'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className='modal-body'>
                    {props.body}
                </div>
                <div className='modal-footer'>
                    <button
                        type='button'
                        className='btn btn-danger'
                        onClick={props.onConfirm}
                        data-bs-dismiss='modal'
                    >
                        {props.confirmButton ?? 'Yes'}
                    </button>
                    <button
                        type='button'
                        className='btn text-light'
                        data-bs-dismiss='modal'
                    >
                        {props.cancelButton ?? 'No'}
                    </button>
                </div>
            </div>
        </div>
    </div>
)

export default Dialog;