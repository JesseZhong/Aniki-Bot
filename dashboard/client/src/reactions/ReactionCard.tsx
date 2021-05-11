import { Reaction } from './Reactions';
import { useState } from 'react';
import ReactionCardView from './ReactionCardView';
import ReactionCardEdit from './ReactionCardEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './ReactionCard.sass';


const ReactionCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const [edit, setEdit] = useState(false);

    return (
        <div
            className={
                'reaction-card' +
                (props.className ? ` ${props.className}` : '')
            }
        >
            {
                !edit &&
                <button
                    type='button'
                    className='edit-btn'
                    onClick={() => setEdit(true)}
                >
                    <FontAwesomeIcon icon={faEdit} />
                </button>
            }
            {
                edit
                ? <ReactionCardEdit reaction={reaction} finishedEdit={() => setEdit(false)} />
                : <ReactionCardView reaction={reaction} />
            }
        </div>
    );
}

export default ReactionCard;