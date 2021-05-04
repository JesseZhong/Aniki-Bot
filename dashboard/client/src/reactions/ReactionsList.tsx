import React from 'react';
import ReactionCard from './ReactionCard';
import { Reactions } from './Reactions';

const ReactionsList = (props: {
    reactions: Reactions,
    className?: string
}) => {

    const reactions = props.reactions

    return (
        <div className={'d-flex flex-wrap ' + props.className}>
            {
                reactions &&
                Array.from(reactions).map(
                    (reaction, index) =>
                        <ReactionCard
                            key={index}
                            reaction={reaction}
                        />
                )
            }
        </div>
    )
}

export default ReactionsList;