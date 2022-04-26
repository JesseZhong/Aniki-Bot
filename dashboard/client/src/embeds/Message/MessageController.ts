import React from 'react';
import $ from 'jquery';
import { MessagePart } from './MessagePart';


export class MessageController {

    private inputSelection?: Selection;

    constructor(
        private inputRef: React.RefObject<HTMLDivElement>,
        private onInsert: (nodes: NodeList) => void
    ) { }

    public register() {
        document.addEventListener('selectionchange', this.onSelectionChange);
        document.addEventListener('beforeinput', this.onBeforeInput);
    }

    public unregister() {
        document.removeEventListener('selectionchange', this.onSelectionChange);
        document.removeEventListener('beforeinput', this.onBeforeInput);
    }

    private onSelectionChange() {
        this.saveSelection(document.getSelection());
    }

    private onBeforeInput(event: InputEvent) {
        const { inputType, data, preventDefault } = event;

        // Let composition through.
        if (
            inputType === 'insertCompositionText' ||
            inputType === 'deleteCompositionText'
        ) {
            return;
        }

        if (
            inputType === 'insertText'
        ) {
            this.insert(data ?? '');
        }

        preventDefault();
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

        else {
            const anchorType = (anchorNode as HTMLSpanElement).getAttribute('data-text-type');
            const focusType = (focusNode as HTMLSpanElement).getAttribute('data-text-type');

            const removeNodes = (
                startNode: Node | null,
                endNode: Node | null
            ) => {
                const parent = startNode?.parentElement;
                if (!parent) {
                    return;
                }

                while (startNode) {

                    parent.removeChild(startNode);
    
                    // Break out once the last node is encountered.
                    if (startNode === endNode) {
                        break;
                    }
                }
            }

            // If both text, merge them.
            if (
                anchorType === 'text' &&
                focusType === 'text'
            ) {
                const anchorText = anchorNode.textContent;
                const focusText = focusNode.textContent;
                anchorNode.textContent =
                    anchorText?.slice(0, start) +
                    text +
                    focusText?.slice(Math.min(end, focusText.length));

                // Remove everything between and the last selected node.
                removeNodes(anchorNode.nextSibling, focusNode);
            }

            else {

                // Just the anchor has text? Insert text there.
                if (anchorType === 'text') {
                    const textContent = anchorNode.textContent;
                    anchorNode.textContent =
                        textContent?.slice(0, start) +
                        text;

                    // Remove everything between and last.
                    removeNodes(anchorNode.nextSibling, focusNode);
                }

                // Maybe just the end? Put here.
                else if (focusType === 'text') {
                    const textContent = focusNode.textContent;
                    focusNode.textContent =
                        text +
                        textContent?.slice(Math.min(end, textContent.length));

                    // Remove first and everything between.
                    removeNodes(anchorNode, focusNode.previousSibling);
                }

                // Ah. Just put it in its own thing.
                else {

                    // Create a new span for text.
                    const newNode = MessagePart.inject_text(text);

                    anchorNode?.parentElement?.insertBefore(
                        newNode,
                        anchorNode
                    );

                    // Removes EVERYTHING.
                    removeNodes(anchorNode, focusNode);
                }
            }
        }

        const current = this.inputRef.current;
        if (current && current.hasChildNodes()) {
            this.onInsert(current.childNodes);
        }
    }
}