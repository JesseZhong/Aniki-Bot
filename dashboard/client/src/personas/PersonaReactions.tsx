import React from 'react';
import PersonaCard from '../personas/PersonaCard';
import ReactionCard from '../reactions/ReactionCard';
import ReactionCardEdit from '../reactions/ReactionCardEdit';
import uuid from 'node-uuid';
import { Persona } from '../personas/Personas';
import { Reaction } from '../reactions/Reactions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './PersonaReactions.sass';


const PersonaReactions = (
    props: {
        persona: [string, Persona],
        reactions: Array<[string, Reaction]>,
        setPersona: (key: string, persona: Persona) => void,
        removePersona: () => void,
        setReaction: (key: string, reaction: Reaction) => void,
        removeReaction: (key: string, reaction: Reaction) => void,
        onResize?: () => void
    }
) => {
    const [addNew, setAddNew] = React.useState(false);
    const [height, setHeight] = React.useState(0);
    const [key, persona] = props.persona;
    const reactions = props.reactions;
    const cardRef = React.createRef<HTMLDivElement>();

    React.useLayoutEffect(
        () => {
            if (cardRef?.current) {
                console.log(`${cardRef.current.offsetHeight} vs ${height}`)
                if (cardRef.current.offsetHeight !== height) {
                    props.onResize?.();
                }

                setHeight(cardRef.current.offsetHeight);
            }
        },
        [cardRef]
    );

    return (
        <PersonaCard
            ref={cardRef}
            persona={persona}
            key={key}
            set={(p: Persona) => props.setPersona(key, p)}
            remove={props.removePersona}
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
            <div className='d-flex flex-column'>
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
            </div>
        </PersonaCard>
    )
}

export default PersonaReactions;