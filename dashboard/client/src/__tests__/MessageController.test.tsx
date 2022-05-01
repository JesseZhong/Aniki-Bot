import React from 'react';
import { render, fireEvent, createEvent } from '@testing-library/react';
import { MessageController } from '../embeds/Message/MessageController';

const msgBoxId = 'message-box';

const selectText = (
    anchor: Node,
    anchorOffset: number,
    focus?: Node,
    focusOffset?: number
) => {
    const selection = document.getSelection();
    if (selection) {
        const range = document.createRange();
        selection.removeAllRanges();

        range.setStart(anchor, anchorOffset);

        if (focus && focusOffset) {
            range.setEnd(focus, focusOffset);
        }
        else {
            range.setEnd(anchor, anchorOffset);
        }

        selection.addRange(range);
    }
}

const resetSelect = () => {
    const selection = document.getSelection();
    if (selection) {
        selection.removeAllRanges();
    }
}

const setup = (
    onInsert: (nodes: NodeList) => void
) => {
    const inputRef = React.createRef<HTMLDivElement>();
    const messageBox = <div
        id='testid'
        className='fake'
        data-testid={msgBoxId}
        ref={inputRef}
        suppressContentEditableWarning
        contentEditable
    >
        <span
            data-text-type='text'
            data-text-index='1'
        >
            We are the people.
        </span>
        <span
            data-text-type='emoji'
            data-text-index='2'
            contentEditable={false}
        >
            <img src='fake' alt='fake' />
        </span>
        <span
            data-text-type='text'
            data-text-index='3'
            data-testid='expected'
        >
            Who rule the world.
        </span>
    </div>;

    const controller = new MessageController(
        inputRef,
        onInsert
    );

    const renderResult = render(messageBox);

    return {
        controller: controller,
        render: renderResult,
        messageBox: messageBox
    };
}

test('should make the same selection after page rerenders', () => {

    const {
        controller,
        render: {
            getByTestId,
            rerender
        },
        messageBox
    } = setup(
        () => {

        }
    );

    const target = getByTestId('expected');

    // Make the selection.
    selectText(target, 0);

    // Save the current selection.
    controller.saveSelection(document.getSelection());

    // Simulate the message box rerendering.
    rerender(messageBox);
    resetSelect();

    // Bring back old selection.
    controller.enforceSelection();

    expect(document.getSelection()?.anchorNode?.isSameNode(getByTestId('expected'))).toBeTruthy();
});