import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Persona } from './Personas';
import './PersonaCreate.sass';

const PersonaCreate = (props: {
    set: (persona: Persona) => void,
    finishedEdit: () => void
}) => {

    return (
        <Formik
            initialValues={{
                name: '',
                avatar: ''
            } as Persona}
            onSubmit={(persona: Persona) => {
                props.set(persona);
                props.finishedEdit();
            }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <div>
                        <Field
                            name='name'
                            placeholder='Persona Name'
                            className='form-control'
                        />
                        <ErrorMessage
                            name='name'
                            component='div'
                            className='text-danger'
                        />
                    </div>
                    <div className='mt-3'>
                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='btn btn-success me-2'
                        >
                            Add
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
    )
}

export default PersonaCreate;