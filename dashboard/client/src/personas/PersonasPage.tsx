import React from 'react';
import { Personas } from './Personas';
import PersonasList from './PersonasList';

const PersonasPage = (props: {
    personas: Personas
}) => (
    <div>
        <PersonasList
            personas={props.personas}
        />
    </div>
)

export default PersonasPage;