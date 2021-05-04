import React from 'react';
import { Personas } from './Personas';
import PersonaCard from './PersonaCard';

const PersonasList = (props: {
    personas: Personas,
    className?: string
}) => {

    const personas = props.personas

    return (
        <div className={'d-flex flex-wrap ' + props.className}>
            {
                personas &&
                Object.entries(personas).map(
                    ([key, persona]) =>
                        <PersonaCard
                            key={key}
                            persona={persona}
                        />
                )
            }
        </div>
    )
}

export default PersonasList;