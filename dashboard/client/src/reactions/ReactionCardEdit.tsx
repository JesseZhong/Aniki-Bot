import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Reaction } from "./Reactions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import VideoClipper from '../embeds/VideoClipper';
import VolumeControl from '../embeds/VolumeControl';
import './ReactionCardEdit.sass';

const ReactionCardEdit = (props: {
    reaction?: Reaction,
    set: (reaction: Reaction) => void,
    finishedEdit: () => void
}) => {

    const reaction = props.reaction;
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
                initialValues={
                    reaction ?? {
                        
                    } as Reaction
                }

                onSubmit={(reaction, { setSubmitting }) => {
                    props.set(reaction);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting, values }) => (
                    <Form className='mx-4'>
                        <div className='input-group input-group-sm flex-nowrap pe-5'>
                            <span className='input-group-text'>
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