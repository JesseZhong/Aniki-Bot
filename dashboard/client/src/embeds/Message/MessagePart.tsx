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
            data-text-type={type}
            className={attributes?.className}
            contentEditable={attributes?.editable}
            suppressContentEditableWarning={attributes?.editable}
            data-testid='message-part'
        >
            {content}
        </span>;
    }

    private static inject_node(
        type: MessagePartType
    ) {
        const node = document.createElement('span');
        node.setAttribute('data-text-type', type);
        node.setAttribute('data-testid', 'message-part');

        return node;
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

    public static inject_media(
        media_text: string
    ) {
        const node = this.inject_node('link');

        // Non-images are appended as link.
        if (!imageRegex.test(media_text)) {
            const link = document.createElement('a');
            
            link.href = media_text;
            link.textContent = media_text;
            link.classList.add('link');

            node.appendChild(link);
        }
        else {
            const image = document.createElement('img');

            image.src = media_text;
            image.alt = media_text;
            image.classList.add('image');

            node.appendChild(image);
            node.contentEditable = 'false';
        }

        return node;
    }

    public static inject_emoji(
        emojis: Emojis,
        emoji: string
    ) {
        const node = this.inject_node('emoji');

        const matches = emoji.match(emojiRegex);
        const name = matches?.groups?.['name'];
        const id = matches?.groups?.['id'];

        if (name && id && emojis) {

            const emoji = emojis.emoji_lookup.get(`${name}:${id}`);

            if (emoji) {
                const image = document.createElement('img');

                image.src = emoji.getEmojiUrl();
                image.alt = `:${emoji.name}:`;
                image.classList.add('emoji');
                image.setAttribute('data-emoji', id);

                node.appendChild(image);
                node.contentEditable = 'false';

                return node;
            }
        }

        node.textContent = emoji;
        return node;
    }

    public static inject_text(
        text: string
    ) {
        const node = this.inject_node('text');
        node.textContent = text;
        return node;
    }
}