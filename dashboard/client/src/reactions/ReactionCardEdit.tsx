import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Reaction } from "./Reactions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import VideoEditor from '../embeds/VideoEditor';
import ReactionValidation from './ReactionValidation';
import './ReactionCardEdit.sass';

const ReactionCardEdit = (props: {
    reaction?: Reaction,
    set: (reaction: Reaction) => void,
    finishedEdit: () => void
}) => {

    const reaction = props.reaction ?? { } as Reaction;
    const [showAudioFields, setShowAudioFields] = useState(!!reaction?.audio_url);

    return (
        <div className='reaction-edit'>
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
                    props.set(reaction);
                    props.finishedEdit();
                    setSubmitting(false);
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
                                    name='triggers'
                                    placeholder='List trigger words, separated by commas'
                                    className='form-control'
                                    value={values?.triggers?.join(', ') ?? ''}
                                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                        const value: string = event.currentTarget.value;
                                        setFieldValue(
                                            'triggers',
                                            value.split(',').map((trigger: string) => trigger.trim()),
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
                        <div className='d-flex flex-column mt-3'>
                            <div className='form-floating'>
                                <Field
                                    id='content'
                                    as='textarea'
                                    name='content'
                                    placeholder='Write a message that will automatically be sent'
                                    className='form-control'
                                />
                                <label htmlFor='content'>
                                    Message
                                </label>
                            </div>
                            <ErrorMessage
                                name='content'
                                component='div'
                                className='text-danger ms-2'
                            />
                        </div>
                        <div className='d-flex flex-column mt-3'>
                            <div className='input-group input-group-sm flex-nowrap'>
                                <span className='input-group-text'>
                                    Audio URL
                                </span>
                                <Field
                                    name='audio_url'
                                    placeholder='YouTube or Twitch Clip'
                                    className='form-control'
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
                                className='mt-3d-flex flex-row mt-3'
                                video_url={values.audio_url}
                                clip_range={values.clip}
                                volume={values.volume}
                                width={500}
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