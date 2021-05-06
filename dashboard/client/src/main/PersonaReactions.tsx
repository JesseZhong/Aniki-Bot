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
            <div>
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
                            />
                    )
            }
            </div>
            <h2>With Personas</h2>
            <div>
            {
                personas &&
                Object.entries(personas).map(
                    ([key, persona]) =>
                            <PersonaCard persona={persona} key={key}>
                            {
                                reactions &&
                                Array.from(reactions)
                                    .filter(
                                        reaction => reaction.persona === key
                                    )
                                    .map(
                                        (reaction, index) =>
                                            <ReactionCard
                                                key={index}
                                                reaction={reaction}
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