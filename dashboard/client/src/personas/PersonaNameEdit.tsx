import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Persona } from './Personas';
import PersonaActions from '../actions/PersonaActions';
import { v4 as uuid } from 'uuid';
import './PersonaNameEdit.sass';

const PersonaNameEdit = (props: {
    persona?: Persona,
    finishedEdit: () => void
}) => {

    const persona = props.persona ?? {
        id: uuid()
    } as Persona;
    const finishedEdit = props.finishedEdit;

    return (
        <Formik
            initialValues={{
                name: persona.name
            }}
            onSubmit={({ name }) => {
                persona.name = name;
                PersonaActions.put(persona);
                finishedEdit();
            }}
        >
            {({ submitForm, values, initialValues }) => (
                <Form>
                    <div className='persona-name-edit-group'>
                        <Field
                            name='name'
                            placeholder='Persona Name'
                            className='form-control'
                            onKeyDown={(e: KeyboardEvent) => {
                                if (e.key === 'Enter') {
                                    submitForm();
                                }
                                else if (e.key === 'Escape') {
                                    finishedEdit();
                                }
                            }}
                            onBlur={() => {
                                // It's okay to close out of editting if nothing has changed.
                                if (values.name === initialValues.name) {
                                    finishedEdit();
                                }
                            }}
                        />
                        <ErrorMessage
                            name='name'
                            component='div'
                            className='text-danger'
                        />
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default PersonaNameEdit;