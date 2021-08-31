import React, { useState } from 'react';
import { Persona } from './Personas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import PersonaNameEdit from './PersonaNameEdit';
import HoverButtonGroup from '../common/HoverButtonGroup';
import Avatar from '../common/Avatar';
import './PersonaCard.sass';

const PersonaCard = React.forwardRef(
    (
        props: {
            persona: Persona,
            set: (persona: Persona) => void,
            remove: () => void,
            className?: string,
            children?: React.ReactNode,
            affixedChild?: JSX.Element
        },
        ref: any
    ) => {
        const [nameEdit, setNameEdit] = useState(false);
        const persona = props.persona;
        const children = props.children;
        const affixedChild = props.affixedChild;
        const nameRef = React.createRef<HTMLDivElement>();

        return (
            <div
                ref={ref}
                className={
                    'persona-card d-flex flex-row' +
                    (props.className ? ` ${props.className}` : '')
                }
            >
                <HoverButtonGroup owner={ref}>
                    <button
                        className='btn btn-sm remove'
                        data-bs-toggle='modal'
                        data-bs-target='#remove-dialog'
                        onClick={props.remove}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </HoverButtonGroup>
                <Avatar
                    src={persona.avatar}
                    alt={persona.name}
                />
                <div className='ms-3 content'>
                    <div className='d-flex flex-row justify-content-between'>
                        <div
                            ref={nameRef}
                            style={{
                                position: 'relative',
                                paddingRight: nameEdit ? '0' : '2.1em',
                                width: nameEdit ? '100%' : 'inherit'
                            }}
                        >
                            {
                                nameEdit
                                ? <PersonaNameEdit
                                    persona={persona}
                                    set={props.set}
                                    finishedEdit={() => setNameEdit(false)}
                                />
                                : <>
                                    <h4 className='align-top'>
                                        {persona.name}
                                    </h4>
                                    <HoverButtonGroup
                                        owner={nameRef}
                                        style={{
                                            top: '-0.4em',
                                            right: '0.2em'
                                        }}
                                    >
                                        <button
                                            type='button'
                                            className='btn btn-sm'
                                            onClick={() => setNameEdit(true)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </HoverButtonGroup>
                                </>
                            }
                        </div>
                        {
                            props.affixedChild &&
                            <div className='align-self-center'>
                                {affixedChild}
                            </div>
                        }
                    </div>
                    <div className='children'>
                        {
                            children &&
                            children
                        }
                    </div>
                </div>
            </div>
        );
    }
)

export default PersonaCard;