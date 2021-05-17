import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Dialog from '../embeds/Dialog';
import PersonaCard from '../personas/PersonaCard';
import { Persona, Personas } from '../personas/Personas';
import ReactionCard from '../reactions/ReactionCard';
import { Reaction, Reactions } from '../reactions/Reactions';


const PersonaReactions = (
    props: {
        personas: Personas,
        reactions: Reactions,
        setPersona: (key: string, persona: Persona) => void,
        setReaction: (key: string, reaction: Reaction) => void,
        removePersona: (key: string) => void,
        removeReaction: (key: string) => void
    }
) => {

    const personas = props.personas;
    const reactions = props.reactions;

    const [diagFields, setDiagFields] = useState({
        title: 'temp',
        body: <></>,
        onConfirm: () => {}
    });

    const removeReaction = (
        key: string,
        reaction: Reaction
    ) => {
        console.log('shit')
        setDiagFields({
            title: 'Remove Reaction?',
            body: <div>

            </div>,
            onConfirm: () => props.removeReaction(key)
        });
    }

    return (
        <div>
            <div className='d-flex flex-row justify-content-between'>
                <h1>
                    Reactions
                </h1>
                <div className='align-self-center'>
                    <button className='btn btn-outline-white text-primary'>
                        <FontAwesomeIcon icon={faPlus} /> Reaction
                    </button>
                </div>
            </div>
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
                                set={(reaction: Reaction) => props.setReaction(key, reaction)}
                                remove={() => removeReaction(key, reaction)}
                                className='mb-3'
                            />
                    )
            }
            </div>
            <div className='d-flex flex-row justify-content-between'>
                <h2>Bot Personas</h2>
                <div className='align-self-center'>
                    <button className='btn btn-outline-white text-primary'>
                        <FontAwesomeIcon icon={faPlus} /> Persona
                    </button>
                </div>
            </div>
            <div>
            {
                personas &&
                Object.entries(personas).map(
                    ([pKey, persona]) =>
                            <PersonaCard
                                persona={persona}
                                key={pKey}
                                className='mb-4'
                                affixedChild={
                                    <button className='btn btn-outline-white text-secondary'>
                                        <FontAwesomeIcon icon={faPlus} /> reaction
                                    </button>
                                }
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
                                                set={(reaction: Reaction) => props.setReaction(key, reaction)}
                                                remove={() => removeReaction(key, reaction)}
                                                className='mb-2'
                                            />
                                    )
                            }
                            </PersonaCard>
                )
            }
            </div>
            <Dialog
                id='remove-dialog'
                title={diagFields.title}
                body={diagFields.body}
                onConfirm={diagFields.onConfirm}
            />
        </div>
    )
}

export default PersonaReactions;