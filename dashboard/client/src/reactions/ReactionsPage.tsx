import React from 'react';
import { Reactions } from './Reactions';
import ReactionsList from './ReactionsList';

const ReactionsPage = (props: {
    reactions: Reactions
}) => (
    <div>
        <ReactionsList
            reactions={props.reactions}
        />
    </div>
)

export default ReactionsPage;