import React from 'react';
import { Reaction } from './Reactions';
import Video from '../embeds/Video';
import './ReactionCard.sass';


const ReactionCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const triggers = reaction.triggers;
    const audio = reaction.audio_url;

    // Split content by words and replace GIF links with img elements.
    const gifRegex = /(https{0,1}:\/\/[^\s]+\.gif[^\s]*)/;
    const contentParts = reaction.content?.split(gifRegex).filter(w => w);
    const content = contentParts?.map(
        (part, index) =>
            part.match(gifRegex)
            ? <img key={index} src={part} alt={part} />
            : <span key={index}>{part}</span>
    )

    return (
        <div
            className={
                'reaction-card' +
                (props.className ? ` ${props.className}` : '')
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
                content &&
                <div>
                    <b>Message:</b>
                    <p>{content}
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