import React from 'react';
import { Reaction } from './Reactions';
import './ReactionCard.sass';

const ReactionCard = (props: {
    reaction: Reaction,
    className?: string
}) => {

    const reaction = props.reaction;

    return (
        <div
            className={
                'reaction-card ' +
                props.className
            }
        >
            <p>
                {reaction.content}
            </p>
        </div>
    );
}

export default ReactionCard;