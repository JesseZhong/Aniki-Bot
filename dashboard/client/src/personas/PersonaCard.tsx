import React from 'react';
import { Persona } from './Personas';
import './PersonaCard.sass';

const PersonaCard = (props: {
    persona: Persona,
    className?: string,
    children?: React.ReactNode,
    affixedChild?: JSX.Element
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
            <div className='ms-3 content'>
                <div className='d-flex flex-row justify-content-between'>
                    <h3 className='align-top'>
                        {persona.name}
                    </h3>
                    {
                        props.affixedChild &&
                        <div className='align-self-center'>
                            {props.affixedChild}
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

export default PersonaCard;