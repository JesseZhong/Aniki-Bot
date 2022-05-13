import React from 'react';
import { Editor, Path, Transforms, Text, Node, Point } from 'slate';
import { RenderElementProps } from 'slate-react';
import { EmojiElement } from '../../slate';
import CodePart from './CodePart';
import DefaultPart from './DefaultPart';
import EmojiPart from './EmojiPart';
import QuotePart from './QuotePart';

const findEmojiText = /.*:(?<emoji>[a-z0-9_]+)/i;

export class MessageController {

    constructor(
        private editor: Editor,
        private onEmojiText?: (
            text: string
        ) => void
    ) { }

    /**
     * Handle how recognized elements are rendered.
     */
    public onRenderElement(
        props: RenderElementProps
    ) {
        switch(props.element.type) {
            case 'code':
                return <CodePart {...props} />;
            case 'emoji':
                return <EmojiPart
                    {...props}
                    element={props.element as EmojiElement}
                />;
            case 'quote':
                return <QuotePart {...props} />;
            default:
                return <DefaultPart {...props} />;
        }
    }

    public onKeyDown(
        event: React.KeyboardEvent<HTMLDivElement>
    ) {
        const selection = this.editor.selection;
        if (!selection) {
            return;
        }

        const key = event.key;
        const {
            anchor,
            focus
        } = selection;

        const isSingleSelection = () =>
            Path.equals(
                anchor.path,
                focus.path
            ) &&
            anchor.offset === focus.offset;

        if (key === ' ') {

            if (isSingleSelection()) {
                const offset = anchor.offset;

                if (offset > 0) {

                    Transforms.setNodes(
                        this.editor,
                        { type: 'code' },
                        { match: this.matchKey('`', offset) }
                    );
        
                    Transforms.setNodes(
                        this.editor,
                        { type: 'quote' },
                        { match: this.matchKey('>', offset) }
                    );
                }
            }
        }
        else if (
            (key >= 'a' && key <= 'z') ||
            (key >= '0' && key <= '9') ||
            (key === '_')
        ) {
            if (isSingleSelection()) {

                const textNode = this.getNode(anchor);

                if (textNode) {

                    // Truncate text after the location,
                    // append the new key, and then check if emoji.
                    const text = (
                        textNode.text.substring(0, anchor.offset) +
                        key
                    ).match(findEmojiText)?.groups?.['emoji'];

                    if (text) {
                        this.onEmojiText?.(text);
                    }
                }
            }
        }
    }

    private matchKey(
        key: string,
        offset: number
    ) {
        return (
            node: Node,
        ) => {
            const result =
                Text.isText(node) &&
                !!node.text &&
                node.text[offset - 1] === key;

            return result;
        }
    }

    private getNode(
        location: Point
    ) {
        const { path } = location;

        let node = this.editor.children;

        for (let i = 0; i < path.length; i++) {
            const current = node[path[i]];

            if ('children' in current) {
                node = current.children;
            }
            else if ('text' in current) {
                return current as Text;
            }
            else {
                return;
            }
        }
    }
}