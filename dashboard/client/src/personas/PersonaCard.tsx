import React from 'react';
import { Persona } from './Personas';
import './PersonaCard.sass';

const PersonaCard = (props: {
    persona: Persona,
    className?: string
}) => {

    const persona = props.persona;

    return (
        <>
            <div
                className={
                    'persona-card ' +
                    props.className
                }
            >
                {persona.name}
            </div>
        </>
    );
}

export default PersonaCard;