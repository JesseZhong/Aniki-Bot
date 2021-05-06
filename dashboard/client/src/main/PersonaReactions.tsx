import React from 'react';
import PersonaCard from '../personas/PersonaCard';
import { Personas } from '../personas/Personas';
import ReactionCard from '../reactions/ReactionCard';
import { Reactions } from '../reactions/Reactions';


const PersonaReactions = (
    props: {
        personas: Personas,
        reactions: Reactions
    }
) => {

    const personas = props.personas;
    const reactions = props.reactions;

    return (
        <div>
            <div className='mb-5'>
            {
                reactions &&
                Array.from(reactions)
                    .filter(
                        reaction => !reaction.persona
                    )
                    .map(
                        (reaction, index) =>
                            <ReactionCard
                                key={index}
                                reaction={reaction}
                                className='mb-3'
                            />
                    )
            }
            </div>
            <h2>Bot Personas</h2>
            <div>
            {
                personas &&
                Object.entries(personas).map(
                    ([key, persona]) =>
                            <PersonaCard
                                persona={persona}
                                key={key}
                                className='mb-4'
                            >
                            {
                                reactions &&
                                Array.from(reactions)
                                    .filter(
                                        reaction => reaction.persona === key
                                    )
                                    .map(
                                        (reaction, index) => 
                                            <ReactionCard
                                                key={`${key}-${index}`}
                                                reaction={reaction}
                                                className='mb-2'
                                            />
                                    )
                            }
                            </PersonaCard>
                )
            }
            </div>
        </div>
    )
}

export default PersonaReactions;