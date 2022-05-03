import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getState } from '../../containers/AppContainer';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';
import EmojiPicker, { getRandomEmoji } from '../../emojis/EmojiPicker';
import Tenor, { Result } from 'react-tenor';
import { MessageTree } from './MessageTree';
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
    const textRef = React.useRef<HTMLDivElement>(null);
    const emojis = getState().emojis;
    const [value, setValue] = React.useState(field.value);

    const messageTree = new MessageTree(value);
    const controller =  new MessageController(
        textRef,
        n => helpers.setValue(messageTree.flatten(n))
    );

    const assignValue = (val: string) => {
        helpers.setValue(val);
        setValue(val);
    }

    React.useEffect(
        () => {
            controller.register();

            return controller.unregister();
        }
    );

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
            value,
            props
        ]
    );

    const renderText = () => ReactDOMServer.renderToString(<>{messageTree.render(emojis)}</>);

    const [showTenor, setShowTenor] = React.useState(false);
    const [showEmojis, setShowEmojis] = React.useState(false);
    const [emojiBtn, setEmojiBtn] = React.useState(getRandomEmoji());


    return (
        <div className={props.className}>
            <div className='d-flex flex-column message'>
                <div className='form-floating main-block'>
                    <div
                        ref={textRef}
                        id={field.name}
                        className='wysiwyg form-control'
                        contentEditable
                        suppressContentEditableWarning
                        dangerouslySetInnerHTML={{ __html: renderText() }}
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
                            controller.insert(encodedEmoji);
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