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
    const textRef = React.createRef<HTMLDivElement>();
    const emojis = getState().emojis;
    const defaultValue = React.useRef(field);

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
            defaultValue,
            field.value
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
    >
        {content}
    </span>;

    /**
     * Transforms text, displaying any media.
     * @param text 
     * @returns Stringified 
     */
    const encode = (text: string): string => {
        console.log(text)

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
            ) as React.ReactNode;

        return ReactDOMServer.renderToString(<>{bodyNodes}</>);
    }

    const decode = (children: NodeListOf<ChildNode>) => {
        let text: string = '';

        (children as NodeList).forEach(
            (item: Node, itemIndex: number) => {
                if (itemIndex > 0) {
                    text += ' ';
                }

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

    const cursorInsert = (value: string) => {
        if (textRef.current && value) {
            const text = textRef.current;

            if (text) {
                const selection = document.getSelection();
                console.log(selection)

                if (
                    selection &&
                    (
                        text.isEqualNode(selection.focusNode) ||
                        text.isEqualNode(selection.focusNode?.parentNode ?? null) ||
                        text.isEqualNode(selection.focusNode?.parentNode?.parentNode ?? null)
                    )
                ) {
                    const range = selection.getRangeAt(0);
                    console.log(range)
                    const start = range.startOffset;
                    const end = range.endOffset;
                    const result = (field.value?.substring(0, start) ?? '')
                        + value
                        + (field.value?.substring(end, field.value.length) ?? '');
                    //helpers.setValue(result);
                    //defaultValue.current.value = result;
                }
                else {
                    
                }
            }
        }
    }

    const onChange = (event: React.FormEvent<HTMLDivElement>) => {
        const text = event.currentTarget;
        const decoded = decode(text.childNodes);

        if (decoded !== field.value) {

            // Emit the change outside the component.
            helpers.setValue(decoded);
            defaultValue.current.value = decoded;
        }
    }

    return (
        <div className={props.className}>
            <div className='d-flex flex-column message'>
                <div className='form-floating main-block'>
                    <div
                        ref={textRef}
                        id={field.name}
                        className='wysiwyg form-control'
                        onInput={onChange}
                        onBlur={onChange}
                        contentEditable
                        suppressContentEditableWarning
                        dangerouslySetInnerHTML={{ __html: encode(defaultValue.current.value ?? '') }}
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