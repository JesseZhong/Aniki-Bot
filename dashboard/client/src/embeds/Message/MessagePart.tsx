import { emojiRegex } from '../../emojis/EmojiPicker';
import { Emojis } from '../../emojis/Emojis';
import { imageRegex } from '../Media';


export type MessagePartType = 'text' | 'link' | 'image' | 'emoji';

export class MessagePart {

    private static enclose_content (
        type: MessagePartType,
        content: JSX.Element | string,
        key?: string | number,
        attributes?: {
            className?: string,
            editable?: boolean
        }
    ) {
        return <span
            key={key}
            data-text-index={key}
            data-text-type={type}
            className={attributes?.className}
            contentEditable={attributes?.editable}
            suppressContentEditableWarning={attributes?.editable}
            data-testid='message-part'
        >
            {content}
        </span>;
    }

    public static as_paragraph(
        children: React.ReactNode,
        key?: string | number
    ) {
        return <p
            key={key}
            data-paragraph-index={key}
            data-testid='paragraph'
        >
            {children}
        </p>;
    }

    public static as_media(
        media_text: string,
        key?: string | number
    ) {
        // Non-images are appended as link.
        if (!imageRegex.test(media_text)) {
            return this.enclose_content(
                'link',
                <a href={media_text}>
                    {media_text}
                </a>,
                key,
                {
                    className: 'link'
                }
            );
        }
        else {
            return this.enclose_content(
                'image',
                <img src={media_text} alt={media_text} className='image' />,
                key,
                {
                    editable: false
                }
            );
        }
    }

    public static as_emoji(
        emojis: Emojis,
        emoji_text: string,
        key?: string | number
    ) {
        const matches = emoji_text.match(emojiRegex);
        const name = matches?.groups?.['name'];
        const id = matches?.groups?.['id'];

        if (name && id && emojis) {

            const emoji = emojis.emoji_lookup.get(`${name}:${id}`);

            if (emoji) {
                return MessagePart.enclose_content(
                    'emoji',
                    <img
                        src={emoji.getEmojiUrl()}
                        alt={`:${emoji.name}:`}
                        data-emoji={emoji.id}
                        className='emoji'
                    />,
                    key,
                    {
                        editable: false
                    }
                );
            }
        }

        return this.enclose_content(
            'emoji',
            <>{`<:${name}:${id}>`}</>,
            key
        );
    }

    public static as_text(
        text: string,
        key?: string | number
    ) {
        return this.enclose_content(
            'text',
            <>{text}</>,
            key
        );
    }
}