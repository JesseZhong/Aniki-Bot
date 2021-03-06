import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { Reaction } from './Reactions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import VideoEditor from '../embeds/VideoEditor';
import Message from '../embeds/Message/Message';
import ReactionValidation from './ReactionValidation';
import ReactionActions from '../actions/ReactionActions';
import { v4 as uuid } from 'uuid';
import './ReactionCardEdit.sass';


const ReactionCardEdit = (props: {
    reaction?: Reaction,
    finishedEdit: () => void,
    onResize?: () => void
}) => {

    const reaction = props.reaction ?? {
        id: uuid()
    } as Reaction;
    const [showAudioFields, setShowAudioFields] = useState(!!reaction?.audio_url);
    const [height, setHeight] = React.useState(0);
    const cardRef = React.createRef<HTMLDivElement>();

    React.useLayoutEffect(
        () => {
            if (cardRef?.current) {
                if (cardRef.current.offsetHeight !== height) {
                    props.onResize?.();

                    setHeight(cardRef.current.offsetHeight);
                }
            }
        },
        [height, props, cardRef]
    );

    return (
        <div
            className='reaction-edit'
            ref={cardRef}
        >
            <button
                type='button'
                className='btn close-btn'
                onClick={props.finishedEdit}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <Formik
                initialValues={reaction}
                validationSchema={ReactionValidation}
                onSubmit={(reaction, { setSubmitting }) => {

                    // Clean up triggers after submission.
                    reaction.triggers = reaction.triggers
                        .filter((item: string) => item)
                        .map((trigger: string) => trigger.trim());

                    ReactionActions.put(reaction);
                    setSubmitting(false);
                    props.finishedEdit();
                }}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className='mx-4'>
                        <div className='d-flex flex-column'>
                            <div className='input-group input-group-sm flex-nowrap pe-5'>
                                <span className='input-group-text'>
                                    Triggers
                                </span>
                                <Field
                                    as='input'
                                    name='triggers'
                                    placeholder='List trigger words, separated by commas'
                                    className='form-control'
                                    value={values?.triggers?.join(',') ?? ''}
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        const value: string = event.currentTarget.value;
                                        setFieldValue(
                                            'triggers',
                                            value.split(/, */),
                                            true
                                        );
                                    }}
                                />
                            </div>
                            <ErrorMessage
                                name='triggers'
                                component='div'
                                className='text-danger ms-2'
                            />
                        </div>
                        <Message
                            className='mt-3'
                            name='content'
                            onResize={props.onResize}
                        />
                        <div className='d-flex flex-column mt-3'>
                            <div className='input-group input-group-sm flex-nowrap'>
                                <span className='input-group-text'>
                                    Audio URL
                                </span>
                                <Field
                                    name='audio_url'
                                    placeholder='YouTube or Twitch Clip'
                                    className='form-control'
                                    value={values.audio_url ?? ''}
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        const value = event.currentTarget.value;
                                        setFieldValue('audio_url', value);
                                        setShowAudioFields(!!value);
                                    }}
                                />
                            </div>
                            <ErrorMessage
                                name='audio_url'
                                component='div'
                                className='text-danger ms-2'
                            />
                        </div>
                        {
                            showAudioFields && values.audio_url &&
                            <VideoEditor
                                className='d-flex flex-row mt-3'
                                video_url={values.audio_url}
                                clip_range={values.clip}
                                volume={values.volume}
                                width={400}
                                setClipRange={
                                    (range?: [number, number]) => {
                                        setFieldValue('clip', range);
                                    }
                                }
                                setVolume={
                                    (volume?: number) => {
                                        setFieldValue('volume', volume);
                                    }
                                }
                            />
                        }
                        <div className='mt-3'>
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='btn btn-success me-2'
                            >
                                Save
                            </button>
                            <button
                                type='button'
                                className='btn text-light'
                                onClick={props.finishedEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ReactionCardEdit;