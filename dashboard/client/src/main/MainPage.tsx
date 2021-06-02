import React from 'react';
import { useState } from 'react';
import { Persona, Personas } from '../personas/Personas';
import { Reaction, Reactions } from '../reactions/Reactions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactionCard from '../reactions/ReactionCard';
import PersonaReactions from './PersonaReactions';
import Dialog from '../embeds/Dialog';
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
) => {
    const personas = props.personas;
    const reactions = props.reactions;

    const [diagFields, setDiagFields] = useState({
        title: 'temp',
        body: <></>,
        onConfirm: () => {}
    });

    if (!personas.size && !reactions) {
        return (
            <div>
                Waiting for data.
            </div>
        )
    }

    const removeReaction = (
        key: string,
        reaction: Reaction
    ) => {
        setDiagFields({
            title: 'Remove Reaction?',
            body:
            <div>
                <p>
                    Are you sure you want to remove <b></b>
                </p>
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
                [...reactions]
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
                [...personas].map(
                    (persona) =>
                        <PersonaReactions
                            key={persona[0]}
                            persona={persona}
                            reactions={
                                [...reactions]
                                    .filter(
                                        ([_rKey, reaction]) => reaction.persona === persona[0]
                                    )
                            }
                            setPersona={props.setPersona}
                            setReaction={props.setReaction}
                            removeReaction={removeReaction}
                        />
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


export default MainPage;