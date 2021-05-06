import React from 'react';
import { Reaction } from './Reactions';
import './ReactionCard.sass';

const ReactionCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const triggers = reaction.triggers;
    const contentByWords = reaction.content?.split(' ')

    return (
        <div
            className={
                'reaction-card ' +
                props.className
            }
        >
            <div>
                <b>
                    Trigger
                    {
                        triggers &&
                        triggers.length > 1 ? 's' : ''
                    }
                    :
                </b>
                <span className='ml-1'>
                {
                    triggers &&
                    triggers.map(
                        (trigger, index) => [
                            index > 0 && ', ',
                            <i
                                key={index}
                                className='text-info'
                            >
                                {trigger}
                            </i>
                        ]
                    )
                }
                </span>
            </div>
            <p>
                {
                    contentByWords &&
                    contentByWords.map(
                        (word, index) =>
                            word.match(/^https{0,1}:\/\/.*\.gif.*/g)
                            ?
                            <>
                                <br />
                                <img
                                    key={index}
                                    src={word}
                                    alt={'gif'}
                                />
                                <br />
                            </>
                            : [
                                index > 0 && ' '
,                                word
                            ]
                    )
                }
            </p>
        </div>
    );
}

export default ReactionCard;