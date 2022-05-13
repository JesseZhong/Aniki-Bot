import React from 'react';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';
import EmojiPicker, { getRandomEmoji } from '../../emojis/EmojiPicker';
import Tenor, { Result } from 'react-tenor';
import { Editable, Slate, withReact } from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { insertEmoji, insertImage, withMedia } from './MessageCommands';
import { MessageController } from './MessageController';
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

    const controller = new MessageController(editor);

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

    const renderElement = React.useCallback(controller.onRenderElement, []);

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
                        }}
                    >
                        <Editable
                            id={field.name}
                            className='wysiwyg form-control'
                            renderElement={renderElement}
                            onKeyDown={event => controller.onKeyDown(event)}
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
                            if (gif) {
                                insertImage(editor, gif);
                            }
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