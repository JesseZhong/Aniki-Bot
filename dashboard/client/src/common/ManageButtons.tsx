import React from 'react';
import HoverButtonGroup from './HoverButtonGroup';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dialog from './Dialog';
import './ManageButtons.sass';


const ManageButtons = (props: {
    owner: React.RefObject<HTMLElement>,
    onEditClick: () => void,
    onRemoveConfirm: () => void
    overlay?: boolean
}) => {

    const [showDialog, setShowDialog] = React.useState(false);
    const overlay = props.overlay;

    return (
        <>
            <HoverButtonGroup
                owner={props.owner}
                className={
                    'manage-buttons' +
                    (overlay ? '-overlay' : '')   
                }
            >
                <button
                    type='button'
                    onClick={() => setShowDialog(true)}
                    className='remove'
                >
                    <FontAwesomeIcon
                        icon={faTrash}
                        size={overlay ? '3x' : '1x'}
                    />
                </button>
                <button
                    type='button'
                    onClick={props.onEditClick}
                    className='edit'
                >
                    <FontAwesomeIcon
                        icon={faEdit}
                        size={overlay ? '3x' : '1x'}
                    />
                </button>
            </HoverButtonGroup>
            {
                showDialog &&
                <Dialog
                    title={''}
                    body={<p></p>}
                    onConfirm={() => {
                        setShowDialog(false);
                        props.onRemoveConfirm();
                    }}
                    onCancel={() => setShowDialog(false)}
                />
            }
        </>
    );
}

export default ManageButtons;