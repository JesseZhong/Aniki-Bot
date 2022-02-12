import React from 'react';
import { Reaction } from './Reactions';
import ReactionCardView from './ReactionCardView';
import ReactionCardEdit from './ReactionCardEdit';
import ManageButtons from '../common/ManageButtons';
import ReactionActions from '../actions/ReactionActions';
import './ReactionCard.sass';


const ReactionCard = (props: {
    reaction: Reaction,
    onResize?: () => void,
    className?: string,
    edit?: boolean
}) => {
    const reaction = props.reaction;
    const [edit, setEdit] = React.useState(!!props.edit);
    const [height, setHeight] = React.useState(0);
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
        <div
            className={
                'reaction-card' +
                (props.className ? ` ${props.className}` : '')
            }
            ref={cardRef}
        >
            {
                <ManageButtons
                    owner={cardRef}
                    onEditClick={() => setEdit(true)}
                    onRemoveConfirm={() => ReactionActions.remove(reaction.id)}
                />
            }
            {
                edit
                ? <ReactionCardEdit
                    reaction={reaction}
                    finishedEdit={() => setEdit(false)}
                    onResize={() => props.onResize?.()}
                />
                : <ReactionCardView
                    reaction={reaction}
                />
            }
        </div>
    );
}

export default ReactionCard;