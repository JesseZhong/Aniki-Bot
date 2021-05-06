import React from 'react';
import { Persona } from './Personas';
import './PersonaCard.sass';

const PersonaCard = (props: {
    persona: Persona,
    className?: string,
    children?: JSX.Element[]
}) => {

    const persona = props.persona;
    const children = props.children;

    return (
        <div
            className={
                'persona-card d-flex flex-row' +
                (props.className ? ` ${props.className}` : '')
            }
        >
            <img
                className='avatar'
                src={persona.avatar}
                alt={persona.name}
            />
            <div className='ml-3 content'>
                <h3 className='align-top'>
                    {persona.name}
                </h3>
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

export default PersonaCard;