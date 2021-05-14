import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Reaction } from "./Reactions";
import VideoClipper from '../embeds/VideoClipper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import VolumeControl from '../embeds/VolumeControl';

const ReactionCardEdit = (props: {
    reaction?: Reaction,
    finishedEdit: () => void
}) => {

    const reaction = props.reaction;
    const [showAudioFields, setShowAudioFields] = useState(!!reaction?.audio_url);

    return (
        <>
            <button
                type='button'
                className='btn btn-danger close-btn text-white'
                onClick={props.finishedEdit}
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
            <Formik
                initialValues={
                    reaction ?? {
                        
                    } as Reaction
                }

                onSubmit={(reaction, { setSubmitting }) => {
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting, values }) => (
                    <Form className='mx-4'>
                        <div className='input-group input-group-sm flex-nowrap'>
                            <span className='input-group-text bg-transparent text-white'>
                                Triggers
                            </span>
                            <Field
                                name='triggers'
                                placeholder='List trigger words, separated by commas'
                                className='form-control'
                            />
                            <ErrorMessage
                                name='triggers'
                                component='div'
                                className='text-danger'
                            />
                        </div>
                        <div className='form-floating mt-3'>
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
                            <ErrorMessage
                                name='content'
                                component='div'
                                className='text-danger'
                            />
                        </div>
                        <div className='input-group input-group-sm flex-nowrap mt-3'>
                            <span className='input-group-text'>
                                Audio URL
                            </span>
                            <Field
                                name='audio_url'
                                placeholder='YouTube or Twitch Clip'
                                className='form-control'
                                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    const value = event.currentTarget.value;
                                    setShowAudioFields(!!value);
                                }}
                            />
                            <ErrorMessage
                                name='audio_url'
                                component='div'
                                className='text-danger'
                            />
                        </div>
                        {
                            showAudioFields &&
                            <div className='d-flex flex-row mt-3'>
                                <div className='form-group'>
                                    <Field name='clip'>
                                        {() => (
                                            <VideoClipper
                                                video_url={values.audio_url}
                                                clip_range={values.clip}
                                                width={500}
                                                set={
                                                    (range?: [number, number]) => {
                                                        values.clip = range;
                                                    }
                                                }
                                            />
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name='start'
                                        component='div'
                                        className='text-danger'
                                    />
                                </div>
                                <div className='ms-3 d-flex flex-column justify-content-end'>
                                    <Field name='volume'>
                                        {() => (
                                            <VolumeControl volume={values.volume} />
                                        )}
                                    </Field>
                                </div>
                            </div>
                        }
                        <div className='mt-3'>
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='btn btn-primary me-2'
                            >
                                Save
                            </button>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                onClick={props.finishedEdit}
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default ReactionCardEdit;