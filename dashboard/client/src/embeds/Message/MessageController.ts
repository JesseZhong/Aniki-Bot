import React from 'react';
import $ from 'jquery';
import { MessagePart } from './MessagePart';


export class MessageController {

    private inputSelection?: Selection;

    constructor(
        private inputRef: React.RefObject<HTMLDivElement>,
        private onInsert: (nodes: NodeList) => void
    ) {
        if (inputRef.current) {
            const current = inputRef.current;

            current.onkeydown = (event) => this.onKeyDown(event);
        }
    }

    private onKeyDown(event: KeyboardEvent) {

        if (event) {

            // Character replacements.
            let code = '';
            switch (event.key) {
                case '<':
                    code = '&lt;';
                    break;
                case '>':
                    code = '&gt;';
                    break;
                default:
                    code = event.key;
                    break;
            }

            switch (event.code) {

                // Backspace
                case '0x000E':
                    this.insert(code, { left: 1 });
                    break;

                // Delete
                case '0xE053':
                    this.insert(code, { right: 1 });
                    break;

                // Arrow Left
                case '0xE04B':
                    break;
                case '0xE04D':
                    break;

                default:
                    this.insert(code);
                    break;
            }

            event.preventDefault();
        }
    }

    public saveSelection(selection?: Selection | null) {
        if (!this.inputRef.current || !selection) {
            this.inputSelection = undefined;
            return;
        }

        const current = this.inputRef.current;

        // Does the selected node belong to the input?
        const selectedParent = $(selection?.anchorNode as Element)?.closest(`div#${current.id}.${current.className.replace(' ', '.')}`);
        if (selectedParent) {
            this.inputSelection = selection;
        }

        // Nothing selected in the input? Release the current selection.
        else {
            this.inputSelection = undefined;
        }
    }

    private resetSelection(
        node: Node,
        offset: number
    ) {
        const selection = document.getSelection();
        if (!selection) {
            return;
        }

        const range = document.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset);

        selection.removeAllRanges();
        selection.addRange(range);

        this.saveSelection(selection);
    }

    /**
     * Insert and maybe even replace text between and
     * including the selected anchor and focus nodes.
     */
    public insert (
        text: string,
        offset?: {
            left?: number,
            right?: number
        }
    ) {
        if (!this.inputSelection) {
            return;
        }

        const {
            anchorNode,
            anchorOffset,
            focusNode,
            focusOffset
        } = this.inputSelection;

        const start = Math.max(anchorOffset - (offset?.left ?? 0), 0);
        const end = focusOffset + (offset?.right ?? 0);

        // Ensure there is a selection at all.
        if (!anchorNode || !focusNode) {
            return;
        }

        // Same node?
        if (anchorNode.isEqualNode(focusNode)) {

            // Text node? Just splice the text in.
            if (anchorNode instanceof Text) {
                const textElement = anchorNode as Text;
                const textContent = textElement.textContent;
                textElement.textContent =
                    textContent?.slice(0, start) +
                    text +
                    textContent?.slice(Math.min(end, textContent.length));

                this.resetSelection(anchorNode, start + 1);
            }

            // Otherwise, insert a new node with the text.
            else {
                if (!anchorNode.hasChildNodes()) {
                    return;
                }

                const children = anchorNode.childNodes;

                // Create a new span for text.
                const newNode = MessagePart.inject_text(text);

                // Insert.
                children.length === focusOffset
                    ? anchorNode.appendChild(newNode)
                    : anchorNode.insertBefore(newNode, children[focusOffset + 1]);

                // Remove all children that were selected (between offsets).
                for(let i = start; i < Math.min(focusOffset, children.length); i++) {
                    anchorNode.removeChild(children[i]);
                }

                // Try to focus selection on the inner text.
                this.resetSelection(newNode.firstChild ?? newNode, 1);
            }
        }

        const current = this.inputRef.current;
        if (current && current.hasChildNodes()) {
            this.onInsert(current.childNodes);
        }
    }
}