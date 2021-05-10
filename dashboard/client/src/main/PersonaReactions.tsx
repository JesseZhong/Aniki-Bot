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
                Object.entries(reactions)
                    .filter(
                        ([_key, reaction]) => !reaction.persona
                    )
                    .map(
                        ([key, reaction]) =>
                            <ReactionCard
                                key={key}
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
                    ([pKey, persona]) =>
                            <PersonaCard
                                persona={persona}
                                key={pKey}
                                className='mb-4'
                            >
                            {
                                reactions &&
                                Object.entries(reactions)
                                    .filter(
                                        ([_rKey, reaction]) => reaction.persona === pKey
                                    )
                                    .map(
                                        ([key, reaction]) => 
                                            <ReactionCard
                                                key={key}
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