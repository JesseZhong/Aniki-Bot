import { Reaction } from './Reactions';
import AudioCard from '../embeds/AudioCard';
import MessagePreview from '../embeds/MessagePreview';
import './ReactionCardView.sass';

const ReactionCardView = (props: {
    reaction: Reaction
}) => {

    const reaction = props.reaction;
    const triggers = reaction.triggers;
    const audio = reaction.audio_url;

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
                reaction.content &&
                <>
                    <hr />
                    <div className='mx-4'>
                        <div className='mb-2'>
                            <b>Message</b>
                        </div>
                        <MessagePreview content={reaction.content} />
                    </div>
                </>
            }
            {
                audio &&
                <>
                    <hr />
                    <div className='mx-4'>
                        <div className='mb-2'>
                            <b>Audio</b>
                        </div>
                        <AudioCard reaction={reaction} />
                    </div>
                </>
            }
        </div>
    )
}

export default ReactionCardView;