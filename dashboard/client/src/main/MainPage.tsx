import React from 'react';
import { Personas } from '../personas/Personas';
import { Reactions } from '../reactions/Reactions';
import PersonaReactions from './PersonaReactions';
import './MainPage.sass';

const MainPage = (
    props: {
        personas: Personas,
        reactions: Reactions
    }
) => {

    const personas = props.personas;
    const reactions = props.reactions;

    return (
        <div>
            <h1>
                Reactions
            </h1>
            <PersonaReactions
                personas={personas}
                reactions={reactions}
            />
        </div>
    )
}

export default MainPage;