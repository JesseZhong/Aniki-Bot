import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Reaction } from "./Reactions";
import VideoClipper from '../embeds/VideoClipper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
                        <div className='form-group'>
                            <label htmlFor='audio_url'>Audio/Video URL</label>
                            <Field
                                name='audio_url'
                                placeholder='YouTube or Twitch Clip'
                                className='form-control'
                                id='audio_url'
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
                            <>
                                <div className='form-group'>
                                    <Field name='yes'>
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
                                <div className='form-group'>
                                    <label htmlFor='volume'>Audio Volume</label>
                                    <Field
                                        type='range'
                                        name='volume'
                                        className='form-control'
                                        id='volume'
                                        min='0'
                                        max='1'
                                        step='0.05'
                                    />
                                    <ErrorMessage
                                        name='volume'
                                        component='div'
                                        className='text-danger'
                                    />
                                </div>
                            </>
                        }
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='btn btn-primary me-2'
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-dark'
                            onClick={props.finishedEdit}
                        >
                            Cancel
                        </button>
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default ReactionCardEdit;