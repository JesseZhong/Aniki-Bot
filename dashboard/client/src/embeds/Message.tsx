import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getState } from '../containers/AppContainer';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';
import EmojiPicker, { emojiRegex, getEmojiUrl, getRandomEmoji, ungroupedEmojiRegex } from '../emojis/EmojiPicker';
import Tenor, { Result } from 'react-tenor';
import { imageRegex, mediaRegex } from './Media';
import './Message.sass';
import './ReactTenor.sass';

const tenorKey = 'LVMDW1I5XR7G';

const Message = (
    props: {
        className?: string,
        onResize?: () => void
    } & FieldHookConfig<any>
) => {
    
    const [field, _meta, helpers] = useField<string>(props);
    const textRef = React.useRef<HTMLDivElement>(null);
    const emojis = getState().emojis;
    const [value, setValue] = React.useState(field.value);
    const [caret, setCaret] = React.useState<number>(0);

    const atCaret = (
        handle: (
            node: Node,
            caretPos: number,
            range: Range
        ) => void
    ) => {
        const selection = document.getSelection();
        if (!selection) {
            return;
        }

        // If the selection is just text, try to grab the closest span parent it belongs to.
        const target = (selection.anchorNode instanceof Text)
            ?
                (
                    selection.anchorNode.parentElement instanceof HTMLSpanElement &&
                    selection.anchorNode.parentElement.hasAttribute('data-text-type')
                )
                ? selection.anchorNode.parentElement
                : selection.anchorNode.parentElement?.closest('span[data-text-type]')
            :
                // If node is the text div, travel down to first span element.
                (
                    selection.anchorNode?.nodeType === Node.ELEMENT_NODE &&
                    selection.anchorNode instanceof HTMLDivElement &&
                    selection.anchorNode.id === field.name
                )
                ? 
                    (
                        selection.anchorNode.hasChildNodes() &&
                        selection.anchorNode.childNodes[0] instanceof HTMLSpanElement
                    )
                    ? selection.anchorNode.childNodes[0] as HTMLSpanElement
                    : null
                : null;

        // Localize the instance of the text box.
        const text = target?.closest(`div#${field.name}`);

        if (
            textRef.current &&
            text &&
            textRef.current.isEqualNode(text) &&
            selection.rangeCount > 0
        ) {
            const range = selection.getRangeAt(0);
            let currentCaret = caret;
            console.log(caret)
    
            const handleText = (textNode: Node) => {
                const length = (textNode as Text).textContent?.length ?? 0;
                if (currentCaret <= length) {
                    handle(textNode, currentCaret, range);
                    return true;
                }
                else {
                    currentCaret -= length;
                    return false;
                }
            }
            
            // Go through children, finding a spot for the caret.
            for (const node of (text.childNodes as NodeList)) {
                if (node instanceof Text) {
                    if (handleText(node)) {
                        return;
                    }
                }
                else if (node instanceof HTMLSpanElement) {

                    for (const textMaybe of (node.childNodes as NodeList)) {
                        if (textMaybe instanceof Text) {
                            if (handleText(textMaybe)) {
                                return;
                            }
                        }
                    }
                }
            }
    
            // Caret can't find a place? Put it at the end.
            // "If the startNode is a Node of type Text, Comment, or CDataSection, then startOffset
            // is the number of characters from the start of startNode. For other Node types, startOffset
            // is the number of child nodes between the start of the startNode."
            // From: https://developer.mozilla.org/en-US/docs/Web/API/Range/setStart
            const end = text.childNodes.length;
            handle(text, end, range);
        }
    }

    atCaret(
        (
            node: Node,
            caretPos: number,
            range: Range
        ) => {
            range.setStart(node, caretPos);
            range.setEnd(node, caretPos);
        }
    );

    const assignValue = (val: string) => {
        helpers.setValue(val);
        setValue(val);
    }

    // Expand and contract the textarea to
    //  the size of the text as the user types.
    React.useEffect(
        () => {
            if (textRef.current) {
                const text = textRef.current;
                text.style.height = 'inherit';
                text.style.height = `${text.scrollHeight + 10}px`;
                props.onResize?.();
            }
        },
        [
            textRef,
            value,
            props
        ]
    );

    const wrap = (
        type: string,
        content: JSX.Element | string,
        key: string | number,
        className?: string,
        editable?: boolean
    ) => <span
        key={key}
        data-text-type={type}
        className={className}
        contentEditable={editable}
        suppressContentEditableWarning={editable}
    >
        {content}
    </span>;

    /**
     * Transforms text, displaying any media.
     * @param text 
     * @returns Stringified 
     */
    const encode = (
        text: string | undefined
    ): string => {
        const bodyNodes = text
            ?.split(new RegExp(`${mediaRegex.source}|${ungroupedEmojiRegex.source}`))
            .filter(w => w)
            .map(
                (part: string, index: number) => {
                    const wrapContent = (
                        type: string,
                        content: JSX.Element | string,
                        className?: string,
                        editable?: boolean
                    ) => wrap(type, content, index, className, editable);

                    const toText = () => wrapContent('text', part);

                    if (mediaRegex.test(part)) {

                        // Non-images are appended as link.
                        if (!imageRegex.test(part)) {
                            return wrapContent('link', part, 'link');
                        }
                        else {
                            return wrapContent(
                                'image',
                                <img src={part} alt={part} className='image' />
                            );  
                        }
                    }

                    // Display emojis.
                    else if (emojiRegex.test(part)) {
                        const matches = part.match(emojiRegex);
                        const name = matches?.groups?.['name'];
                        const id = matches?.groups?.['id'];

                        if (name && id && emojis) {

                            const emoji = emojis.emoji_lookup.get(`${name}:${id}`);

                            return emoji
                                ? wrapContent(
                                    'image',
                                    <img
                                        src={getEmojiUrl(emoji.id, emoji.animated)}
                                        alt={`:${emoji.name}:`}
                                        data-emoji={emoji.id}
                                        className='emoji'
                                    />,
                                    undefined,
                                    false
                                )
                                : toText();
                        }
                        else {
                            return toText();
                        }
                    }
                    else {
                        return toText();
                    }
                }
            )
            ?? wrap('text', '', 0, undefined, true) as React.ReactNode;

        return ReactDOMServer.renderToString(<>{bodyNodes}</>);
    }

    const decode = (children: NodeListOf<ChildNode>) => {
        let text: string = '';

        (children as NodeList).forEach(
            (item: Node) => {

                if (item instanceof HTMLSpanElement) {

                    (item.childNodes as NodeList).forEach(
                        (itemContent: Node) => {

                            if (itemContent instanceof Text) {
                                text += (itemContent as Text).nodeValue;
                            }

                            else if (itemContent instanceof HTMLImageElement) {

                                if (itemContent.hasAttribute('data-emoji')) {
                                    const name = itemContent.getAttribute('alt');
                                    const id = itemContent.getAttribute('data-emoji');

                                    if (name && id) {
                                        text += `<:${name}:${id}>`;
                                    }
                                }
                                else {
                                    text += (itemContent as HTMLImageElement).src;
                                }
                            }
                        }
                    )
                }
                else if (item instanceof Text) {
                    text += item.nodeValue;
                }
            }
        );

        return text;
    }

    const [showTenor, setShowTenor] = React.useState(false);
    const [showEmojis, setShowEmojis] = React.useState(false);
    const [emojiBtn, setEmojiBtn] = React.useState(getRandomEmoji());

    const insertText = (
        text: string
    ) => {
        atCaret(
            (
                node: Node,
                caretPos: number,
                range: Range
            ) => {
                const currentText = node.textContent;
                node.textContent = (currentText?.substring(0, range.startOffset) ?? '')
                    + text
                    + (currentText?.substring(range.endOffset, currentText.length) ?? '');

                if (textRef.current) {
                    const decoded = decode(textRef.current.childNodes);
                    assignValue(decoded);
        
                    const newPos = caretPos + text.length;
                    setCaret(newPos);
                }
            }
        );
    }

    const cursorInsert = (text: string) => {
        if (textRef.current && text) {
            insertText(text);

            const current = textRef.current;
            const decoded = decode(current.childNodes);
            assignValue(decoded);
        }
    }

    const onKeyDown = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        const selection = document.getSelection();

        if (selection && event) {
            const range = selection.getRangeAt(0);
            if (!range) {
                return;
            }

            const start = range.startOffset;
            const end = range.endOffset;

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
                    if (start === end) {
                        if (start <= 0) {
                            return;
                        }


                    }
                    else {

                    }
                    break;

                // Delete
                case '0xE053':
                    if (start === end) {
                        if (end >= value.length) {
                            return;
                        }

                    }
                    else {

                    }
                    break;

                // Arrow Left
                case '0xE04B':
                    break;
                case '0xE04D':
                    break;

                default:
                    insertText(code);
                    break;
            }

            event.preventDefault();
        }
    }

    return (
        <div className={props.className}>
            <div className='d-flex flex-column message'>
                <div className='form-floating main-block'>
                    <div
                        ref={textRef}
                        id={field.name}
                        onKeyDown={onKeyDown}
                        className='wysiwyg form-control'
                        contentEditable
                        suppressContentEditableWarning
                        dangerouslySetInnerHTML={{ __html: encode(value) }}
                    />
                    <label htmlFor={field.name}>
                        Message
                    </label>
                    <div className='d-flex flex-row tidbits'>
                        <button
                            type='button'
                            className='gif-button'
                            onClick={() => setShowTenor(!showTenor)}
                        >
                            GIF
                        </button>
                        <button
                            type='button'
                            className='emoji-button'
                            onClick={() => {
                                setShowEmojis(!showEmojis);
                                setEmojiBtn(getRandomEmoji());
                            }}
                        >
                            {
                                emojiBtn
                                ? <img
                                    src={emojiBtn}
                                    alt='Emoji Button.'
                                />
                                : 'Emoji'
                            }
                        </button>
                    </div>
                </div>
                {
                    showTenor &&
                    <Tenor
                        token={tenorKey}
                        onSelect={(result: Result) => {
                            const gif = result.media[0].gif.url;
                            const text = field.value
                                ? `${field.value}\n${gif}`
                                : gif
                            helpers.setValue(text, true);
                        }}
                        searchPlaceholder='Search Tenor'
                    />
                }
                {
                    showEmojis &&
                    <EmojiPicker
                        onClick={(encodedEmoji: string) => {
                            cursorInsert(encodedEmoji);
                        }}
                    />
                }
                <ErrorMessage
                    name={field.name}
                    component='div'
                    className='text-danger ms-2'
                />
            </div>
        </div>
    );
}

export default Message;