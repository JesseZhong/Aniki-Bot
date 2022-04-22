import { emojiRegex, ungroupedEmojiRegex } from "../../emojis/EmojiPicker";
import { Emojis } from "../../emojis/Emojis";
import { imageRegex, mediaRegex } from "../Media";
import { MessageNode, MessageNodeType } from "./MessageNode";


export class MessageTree {

    private _text: string;
    private _root?: MessageNode;

    constructor(
        text?: string
    ) {
        this._text = text ?? '';
        this.populate();
    }

    public get() {
        return this._text;
    }

    /**
     * Breakdown the text and build out the message tree.
     */
    private populate(): void {
        this._root = this.breakdown(this._text);
    }

    /**
     * Recursively break down text into its individual parts.
     */
    private breakdown(
        text?: string,
        node?: MessageNode
    ): MessageNode {

        // Build a new tree from the root.
        if (!node) {

            // Breakdown into lines.
            const lines = text?.split('\n').filter(w => w);

            // Nothing? Empty tree it is.
            if (!lines) {
                return new MessageNode({
                    type: MessageNodeType.ROOT
                });
            }

            // More than one line? Split it out.
            if (lines.length > 1) {
                const children = [];

                for (const line of lines) {
                    children.push(
                        this.breakdown(
                            line,
                            new MessageNode({
                                type: MessageNodeType.PARAGRAPH
                            })
                        )
                    );
                }

                return new MessageNode({
                    type: MessageNodeType.ROOT,
                    children: children
                });
            }

            // Otherwise pass down.
            else {
                return this.breakdown(
                    text,
                    new MessageNode({
                        type: MessageNodeType.ROOT
                    })
                );
            }
        }

        else {

            // Breakout text into recognizable parts.
            const parts = text?.split(new RegExp(`${mediaRegex.source}|${ungroupedEmojiRegex.source}`))
                .filter(w => w);

            // No parts? Send it back as is.
            if (!parts) {
                return node;
            }

            const children = [];

            for (const part of parts) {

                // Media maybe?
                if (mediaRegex.test(part)) {
                    children.push(new MessageNode({
                        type: MessageNodeType.MEDIA,
                        rawText: part
                    }));
                }

                // Maybe emoji?
                else if (emojiRegex.test(part)) {
                    children.push(new MessageNode({
                        type: MessageNodeType.EMOJI,
                        rawText: part
                    }));
                }
        
                else {
        
                    // Default is to text.
                    children.push(new MessageNode({
                        type: MessageNodeType.TEXT,
                        rawText: text
                    }));
                }
            }

            node.children = children;

            return node;
        }
    }

    /**
     * Render the JSX for the text.
     */
    public render(
        emojis: Emojis
    ): React.ReactNode {
        return this.render_part(
            emojis,
            this._root
        );
    }

    private render_part(
        emojis: Emojis,
        node?: MessageNode,
        index: number = 0
    ): React.ReactNode {

        if (!node) {
            return null;
        }

        else {

            switch(node.type) {

                // Root? Just render children into fragment.
                case MessageNodeType.ROOT:
                    return <>
                        {node.children?.map((part, index) => this.render_part(emojis, part, index))}
                    </>;

                // Wrap paragraphs with tags.
                case MessageNodeType.PARAGRAPH:
                    return <p key={index} data-testid='paragraph'>
                        {node.children?.map((part, index) => this.render_part(emojis, part, index))}
                    </p>;

                case MessageNodeType.MEDIA:
                    if (!node.rawText) {
                        return null;
                    }

                    // Non-images are appended as link.
                    if (!imageRegex.test(node.rawText)) {
                        return this.wrap_part(
                            'link',
                            <a href={node?.rawText}>
                                {node?.rawText}
                            </a>,
                            index,
                            {
                                className: 'link'
                            }
                        );
                    }
                    else {
                        return this.wrap_part(
                            'image',
                            <img src={node.rawText} alt={node.rawText} className='image' />,
                            index
                        );
                    }

                case MessageNodeType.EMOJI:
                    if (!node.rawText) {
                        return null;
                    }

                    const matches = node.rawText.match(emojiRegex);
                    const name = matches?.groups?.['name'];
                    const id = matches?.groups?.['id'];

                    const to_text = () => this.wrap_part(
                        'emoji',
                        <>{node.rawText}</>,
                        index
                    );

                    if (name && id && emojis) {

                        const emoji = emojis.emoji_lookup.get(`${name}:${id}`);

                        return emoji
                            ? this.wrap_part(
                                'emoji',
                                <img
                                    src={emoji.getEmojiUrl()}
                                    alt={`:${emoji.name}:`}
                                    data-emoji={emoji.id}
                                    className='emoji'
                                />,
                                index,
                                {
                                    editable: false
                                }
                            )
                            : to_text();
                    }
                    else {
                        return to_text();
                    }

                case MessageNodeType.TEXT:
                    if (!node.rawText) {
                        return null;
                    }

                    return this.wrap_part(
                        'text',
                        <>{node.rawText}</>,
                        index
                    );
                    
                default:
                    return null;
            }
        }
    }

    private wrap_part (
        type: string,
        content: JSX.Element | string,
        key: string | number,
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
}