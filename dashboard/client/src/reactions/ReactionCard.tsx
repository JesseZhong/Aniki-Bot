import React from 'react';
import { Reaction } from './Reactions';
import { useState } from 'react';
import ReactionCardView from './ReactionCardView';
import ReactionCardEdit from './ReactionCardEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import HoverButtonGroup from '../common/HoverButtonGroup';
import './ReactionCard.sass';


const ReactionCard = (props: {
    reaction: Reaction,
    set: (reaction: Reaction) => void,
    remove: () => void,
    className?: string,
    edit?: boolean
}) => {
    const reaction = props.reaction;
    const [edit, setEdit] = useState(!!props.edit);
    const cardRef = React.createRef<HTMLDivElement>();

    return (
        <div
            className={
                'reaction-card' +
                (props.className ? ` ${props.className}` : '')
            }
            ref={cardRef}
        >
            {
                !edit &&
                <HoverButtonGroup owner={cardRef}>
                    <button
                        type='button'
                        className='btn btn-sm'
                        onClick={() => setEdit(true)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                        className='btn btn-sm'
                        data-bs-toggle='modal'
                        data-bs-target='#remove-dialog'
                        onClick={props.remove}
                    >
                        <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                </HoverButtonGroup>
            }
            {
                edit
                ? <ReactionCardEdit
                    reaction={reaction}
                    set={props.set}
                    finishedEdit={() => setEdit(false)}
                />
                : <ReactionCardView reaction={reaction} />
            }
        </div>
    );
}

export default ReactionCard;