import React from 'react';
import uuid from 'node-uuid';
import PersonaCard from '../personas/PersonaCard';
import ReactionCard from '../reactions/ReactionCard';
import ReactionCardEdit from '../reactions/ReactionCardEdit';
import { Persona } from '../personas/Personas';
import { Reaction } from '../reactions/Reactions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './PersonaReactions.sass';


const PersonaReactions = (
    props: {
        persona: [string, Persona],
        reactions: Array<[string, Reaction]>,
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
                if (cardRef.current.offsetHeight !== height) {
                    props.onResize?.();

                    setHeight(cardRef.current.offsetHeight);
                }
            }
        },
        [height, props, cardRef]
    );

    return (
        <PersonaCard
            ref={cardRef}
            persona={persona}
            affixedChild={
                <button
                    type='button'
                    className='btn btn-outline-white text-secondary text-nowrap'
                    onClick={() => setAddNew(!addNew)}
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
                                    reaction={reaction}
                                    className='mb-2'
                                    onResize={() => props.onResize?.()}
                                />
                        )
                }
            </div>
        </PersonaCard>
    )
}

export default PersonaReactions;