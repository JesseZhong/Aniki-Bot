import React from 'react';
import { emojiRegex, ungroupedEmojiRegex } from '../../emojis/EmojiPicker';
import { Emojis } from '../../emojis/Emojis';
import { mediaRegex } from '../Media';
import { MessageNode, MessageNodeType } from './MessageNode';
import { MessagePart } from './MessagePart';

export class MessageTree {

    private _root?: MessageNode;

    constructor(
        text?: string
    ) {
        this.populate(text);
    }

    /**
     * Breakdown the text and build out the message tree.
     */
    public populate(text?: string): void {
        this._root = this.breakdown(text ?? '');
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
            const lines = text?.split('\n');

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
            const parts = text?.split(
                    new RegExp(
                        `${mediaRegex.source}|${ungroupedEmojiRegex.source}`,
                        'i'
                    )
                )
                .filter(w => w);

            const children = [];

            // No parts? Put at least an empty one that can be filled later.
            if (!parts || parts.length === 0) {
                children.push(new MessageNode({
                    type: MessageNodeType.TEXT,
                    rawText: ''
                }));
            }

            else {
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
                    return MessagePart.as_paragraph(
                        node.children?.map(
                            (
                                part,
                                index
                            ) => this.render_part(emojis, part, index)
                        ),
                        index
                    );

                case MessageNodeType.MEDIA:
                    if (!node.rawText) {
                        return null;
                    }

                    return MessagePart.as_media(
                        node.rawText,
                        index
                    );

                case MessageNodeType.EMOJI:
                    if (!node.rawText) {
                        return null;
                    }

                    return MessagePart.as_emoji(
                        emojis,
                        node.rawText,
                        index
                    );

                case MessageNodeType.TEXT:
                    return MessagePart.as_text(node.rawText ?? '', index);
                    
                default:
                    return null;
            }
        }
    }

    /**
     * Parses nodes and populate the message tree with the result.
     */
    public parse(nodes: NodeList): void {

        this.populate(this.flatten_nodes(nodes));
    }

    public flatten(nodes: NodeList): string {
        return this.flatten_nodes(nodes);
    }

    /**
     * Recursively traverse nodes, flattening them out to plain text.
     */
    private flatten_nodes(
        nodes: NodeList,
        max_depth: number = 10
    ): string {

        // Drop everything past the max depth.
        if (max_depth <= 0) {
            return '';
        }

        let result = '';

        nodes.forEach(
            (node: Node) => {

                // Plain text.
                if (node instanceof Text) {
                    result += (node as Text).nodeValue;
                }

                // Layouts.
                else if (
                    node instanceof HTMLDivElement ||
                    node instanceof HTMLSpanElement ||
                    node instanceof HTMLParagraphElement
                ) {
                    // Add newline for paragraph if there's a node before.
                    if (node instanceof HTMLParagraphElement && node.previousSibling) {
                        result += '\n';
                    }

                    if (node.hasChildNodes()) {
                        result += this.flatten_nodes(
                            node.childNodes,
                            max_depth - 1
                        );
                    }

                    // Add newline for paragraph if there is a non-paragraph node after.
                    if (
                        node instanceof HTMLParagraphElement &&
                        node.nextSibling &&
                        !(node.nextSibling instanceof HTMLParagraphElement)
                    ) {
                        result += '\n';
                    }
                }

                // Images and emotes.
                else if (node instanceof HTMLImageElement) {

                    const image = node as HTMLImageElement;

                    // Check if emoji.
                    if (node.hasAttribute('data-emoji')) {
                        const id = image.getAttribute('data-emoji');
                        const name = /^:{0,1}([a-z0-9_]{2,}):{0,1}$/i.exec(image.alt)?.[1];
                        result += `<:${name}:${id}>`;
                    }

                    // Append the source for regular images.
                    else {
                        result += image.src;
                    }
                }

                // Links.
                else if (node instanceof HTMLAnchorElement) {

                    result += (node as HTMLAnchorElement).href;
                }

                // Line breaks man.
                else if (node instanceof HTMLBRElement) {

                    result += '\n';
                }
            }
        )

        return result;
    }
}