import React from 'react';
import { ErrorMessage, FieldHookConfig, useField } from 'formik';
import Tenor, { Result } from 'react-tenor';
import './Message.sass';
import './ReactTenor.sass';

const tenorKey = 'LVMDW1I5XR7G';

const Message = (
    props: {
        className?: string,
        onResize?: () => void
    } & FieldHookConfig<any>
) => {
    
    const [field, meta, helpers] = useField(props);
    const textRef = React.createRef<HTMLTextAreaElement>();

    // Expand and contract the textarea to
    //  the size of the text as the user types.
    React.useEffect(
        () => {
            if (textRef.current) {
                const text = textRef.current;
                text.style.height = 'inherit';
                text.style.height = `${text.scrollHeight + 10}px`;
            }
        },
        [field.value]
    );

    return (
        <div className={props.className}>
            <div className='d-flex flex-column message'>
                <div className='form-floating'>
                    <textarea
                        ref={textRef}
                        {...field}
                        id={field.name}
                        className='form-control'
                    />
                    <label htmlFor={field.name}>
                        Message
                    </label>
                </div>
                <Tenor
                    token={tenorKey}
                    onSelect={(result: Result) => {
                        const gif = result.media[0].gif.url;
                        const text = field.value
                            ? `${field.value}\n${gif}`
                            : gif
                        helpers.setValue(text, true);
                    }}
                    searchPlaceholder='Search GIFs'
                />
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