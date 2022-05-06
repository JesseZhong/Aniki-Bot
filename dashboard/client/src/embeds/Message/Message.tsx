import React from 'react';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';
import EmojiPicker, { getRandomEmoji } from '../../emojis/EmojiPicker';
import Tenor, { Result } from 'react-tenor';
import { DefaultElement, Editable, RenderElementProps, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { EmojiElement } from '../../slate';
import { insertEmoji, withMedia } from './MessageCommands';
import EmojiPart from './EmojiPart';
import CodePart from './CodePart';
import './Message.sass';
import './ReactTenor.sass';


const tenorKey = 'LVMDW1I5XR7G';

const Message = (
    props: {
        className?: string,
        onResize?: () => void
    } & FieldHookConfig<any>
) => {
    
    // eslint-disable-next-line
    const [field, _meta, helpers] = useField<string>(props);

    const [editor] = React.useState(() => withMedia(withReact(createEditor())));

    const textRef = React.useRef<HTMLDivElement>(null);

    // Expand and contract the textarea to
    // the size of the text as the user types.
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
            props
        ]
    );

    const [showTenor, setShowTenor] = React.useState(false);
    const [showEmojis, setShowEmojis] = React.useState(false);
    const [emojiBtn, setEmojiBtn] = React.useState(getRandomEmoji());

    const renderElement = React.useCallback(
        (props: RenderElementProps) => {
            switch(props.element.type) {
                case 'code':
                    return <CodePart {...props} />;
                case 'emoji':
                    return <EmojiPart
                        {...props}
                        element={props.element as EmojiElement}
                    />;
                default:
                    return <DefaultElement {...props} />;
            }
        },
        []
    );

    const initialValue: Descendant[] = [
        {
            type: 'paragraph',
            children: field.value.split('\n').map(text => ({
                text: text
            }))
        }
    ];

    return (
        <div className={props.className}>
            <div className='d-flex flex-column message'>
                <div
                    ref={textRef}
                    className='form-floating main-block'
                >
                    <Slate
                        editor={editor}
                        value={initialValue}
                        onChange={(value: Descendant[]) => {
                            console.log(value)
                        }}
                    >
                        <Editable
                            id={field.name}
                            className='wysiwyg form-control'
                            renderElement={renderElement}
                        />
                    </Slate>
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
                        onClick={(
                            encodedEmoji: string,
                            name: string,
                            id: string
                        ) => {
                            insertEmoji(
                                editor,
                                name,
                                id
                            );
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