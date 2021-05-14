import { Reaction } from './Reactions';
import AudioCard from '../embeds/AudioCard';
import './ReactionCardView.sass';

const ReactionCardView = (props: {
    reaction: Reaction,
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
        <div className='reaction-view'>
            <div className='mx-4 d-flex flex-column'>
                <b>
                    Trigger
                    {
                        triggers &&
                        triggers.length > 1 ? 's' : ''
                    }
                </b>
                <span>
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
                <>
                    <hr />
                    <div className='mx-4'>
                        <b>Message</b>
                        <div className='d-flex flex-column message-content'>
                            {content}
                        </div>
                    </div>
                </>
            }
            {
                audio &&
                <>
                    <hr />
                    <AudioCard
                        className='mx-4'
                        reaction={reaction}
                    />
                </>
            }
        </div>
    )
}

export default ReactionCardView;