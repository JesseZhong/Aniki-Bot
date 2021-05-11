import React from 'react';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { Reaction } from "./Reactions";

const ReactionCardEdit = (props: {
    reaction?: Reaction,
    finishedEdit: () => void
}) => {

    const reaction = props.reaction;
    const [showAudioFields, setShowAudioFields] = useState(!!reaction?.audio_url);

    return (
        <>
            <Formik
                initialValues={
                    reaction ?? {
                        
                    } as Reaction
                }

                onSubmit={(reaction, { setSubmitting }) => {
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className='mx-4'>
                        <div className='form-group'>
                            <label htmlFor='audio_url'>Audio/Video URL</label>
                            <Field
                                name='audio_url'
                                placeholder='YouTube or Twitch Clip'
                                className='form-control'
                                id='audio_url'
                                onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                    setShowAudioFields(!!event.currentTarget.value);
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
                                    <label htmlFor='start'>Start Time</label>
                                    <Field
                                        name='start'
                                        className='form-control'
                                        placeholder='HH:MM:SS'
                                        id='start'
                                    />
                                    <ErrorMessage
                                        name='start'
                                        component='div'
                                        className='text-danger'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='audio_url'>End Time</label>
                                    <Field
                                        name='end'
                                        className='form-control'
                                        placeholder='HH:MM:SS'
                                        id='end'
                                    />
                                    <ErrorMessage
                                        name='end'
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
                            className='btn btn-primary mr-2'
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