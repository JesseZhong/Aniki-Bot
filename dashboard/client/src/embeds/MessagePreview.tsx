import Media, { mediaRegex } from '../embeds/Media';
import './MessagePreview.sass';

const MessagePreview = (props: {
    content: string
}) => {

    // Split content by words and replace GIF links with img elements.
    // Also, newlines.
    const newLineRegex = /(\n)/;
    const contentParts = props.content
        ?.split(new RegExp(`${mediaRegex.source}|${newLineRegex.source}`))
        .filter(w => w);
    const content = 
        contentParts?.map(
            (part, index) =>
                part.match(mediaRegex)
                ? <Media
                    key={index}
                    url={part}
                />
                : part.match(newLineRegex)
                    ? <br key={index} />
                    : <span key={index}>{part}</span>
        );

    return <div className='d-flex flex-column message-preview'>
        {content}
    </div>;
}




export default MessagePreview;