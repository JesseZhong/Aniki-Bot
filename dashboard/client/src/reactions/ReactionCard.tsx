import React from 'react';
import { Reaction } from './Reactions';
import './ReactionCard.sass';
import Video from '../embeds/Video';

const ReactionCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const triggers = reaction.triggers;
    const contentByWords = reaction.content?.split(' ')
    const audio = reaction.audio_url;

    return (
        <div
            className={
                'reaction-card ' +
                (props.className || '')
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
            {
                contentByWords &&
                <div>
                    <b>Message:</b>
                    <p>
                    {
                        contentByWords.map(
                            (word, index) =>
                                word.match(/^https{0,1}:\/\/.*\.gif.*/)
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
                                    index > 0 && ' ',
                                    word
                                ]
                        )
                    }
                    </p>
                </div>
            }
            {
                audio &&
                <div>
                    <b>Audio:</b>
                    <Video url={audio} />
                </div>
            }
        </div>
    );
}

export default ReactionCard;