import React from 'react';
import { Persona, Personas } from '../personas/Personas';
import { Reaction, Reactions } from '../reactions/Reactions';
import PersonaReactions from './PersonaReactions';
import './MainPage.sass';

const MainPage = (
    props: {
        personas: Personas,
        reactions: Reactions
        setPersona: (key: string, persona: Persona) => void,
        setReaction: (key: string, reaction: Reaction) => void,
        removePersona: (key: string) => void,
        removeReaction: (key: string) => void
    }
) => (
    <div>
        <PersonaReactions {...props} />
    </div>
)


export default MainPage;