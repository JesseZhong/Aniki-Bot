import PersonaCard from '../personas/PersonaCard';
import { Persona } from '../personas/Personas';
import ReactionCard from '../reactions/ReactionCard';
import { Reaction } from '../reactions/Reactions';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import ReactionCardEdit from '../reactions/ReactionCardEdit';
import uuid from 'node-uuid';
import './PersonaReactions.sass';


const PersonaReactions = (
    props: {
        persona: [string, Persona],
        reactions: Array<[string, Reaction]>,
        setPersona: (key: string, persona: Persona) => void,
        removePersona: () => void,
        setReaction: (key: string, reaction: Reaction) => void,
        removeReaction: (key: string, reaction: Reaction) => void
    }
) => {

    const [addNew, setAddNew] = useState(false);
    const [key, persona] = props.persona;
    const reactions = props.reactions;

    return (
        <PersonaCard
            persona={persona}
            key={key}
            set={(p: Persona) => props.setPersona(key, p)}
            remove={props.removePersona}
            className='mb-4'
            affixedChild={
                <button
                    type='button'
                    className='btn btn-outline-white text-secondary text-nowrap'
                    onClick={() => setAddNew(true)}
                >
                    <FontAwesomeIcon icon={faPlus} /> reaction
                </button>
            }
        >
            {
                addNew &&
                <div className='reaction-add my-2'>
                    <ReactionCardEdit
                        set={
                            (reaction: Reaction) => {
                                reaction.persona = key;
                                props.setReaction(uuid.v4(), reaction);
                                setAddNew(false);
                            }
                        }
                        finishedEdit={() => setAddNew(false)}
                    />
                </div>
            }
            {
                reactions &&
                reactions
                    .map(
                        ([key, reaction]) => 
                            <ReactionCard
                                key={key}
                                reaction={reaction}
                                set={(reaction: Reaction) => props.setReaction(key, reaction)}
                                remove={() => props.removeReaction(key, reaction)}
                                className='mb-2'
                            />
                    )
            }
        </PersonaCard>
    )
}

export default PersonaReactions;