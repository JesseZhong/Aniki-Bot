import { Reaction } from './Reactions';
import { useState } from 'react';
import ReactionCardView from './ReactionCardView';
import ReactionCardEdit from './ReactionCardEdit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
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
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={
                'reaction-card' +
                (props.className ? ` ${props.className}` : '')
            }
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {
                !edit && hovered &&
                <div className='btn-group edit'>
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
                </div>
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