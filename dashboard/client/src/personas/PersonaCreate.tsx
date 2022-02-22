import React from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Persona } from './Personas';
import PersonaNameValidation from './PersonaNameValidation';
import PersonaAvatarValidation from './PersonaAvatarValidation';
import Avatar from '../common/Avatar';
import PersonaActions from '../actions/PersonaActions';
import { v4 as uuid } from 'uuid';
import './PersonaCreate.sass';


const PersonaCreate = (props: {
    finishedEdit: () => void,
    existingNames: Set<string>
}) => {

    return (
        <div className='persona-create'>
            <Formik
                initialValues={{
                    id: uuid(),
                    name: '',
                    avatar: ''
                } as Persona}
                validationSchema={
                    PersonaNameValidation(props.existingNames)
                        .concat(PersonaAvatarValidation)
                }
                onSubmit={(persona: Persona) => {
                    PersonaActions.put(persona);
                    props.finishedEdit();
                }}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <div className='d-flex flex-row'>
                            <div
                                className='d-flex flex-column justify-content-center overflow-hidden'
                                style={{
                                    width: '5em'
                                }}
                            >
                                {
                                    values.avatar
                                    ? <Avatar
                                        src={values.avatar}
                                        alt='REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE'
                                    />
                                    : <span>
                                        Preview
                                    </span>
                                }
                            </div>
                            <div
                                className='d-flex flex-column ms-3'
                                style={{
                                    width: '100%'
                                }}
                            >
                                <div className='d-flex flex-column'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Persona Name
                                        </span>
                                        <Field
                                            name='name'
                                            placeholder='Chumbuddy'
                                            className='form-control'
                                        />
                                    </div>
                                    <ErrorMessage
                                        name='name'
                                        component='div'
                                        className='text-danger'
                                    />
                                </div>
                                <div className='d-flex flex-column mt-2'>
                                    <div className='input-group input-group-sm flex-nowrap pe-5'>
                                        <span className='input-group-text'>
                                            Avatar URL
                                        </span>
                                        <Field
                                            name='avatar'
                                            placeholder='https://www.example.com/image.png'
                                            className='form-control'
                                        />
                                    </div>
                                    <ErrorMessage
                                        name='avatar'
                                        component='div'
                                        className='text-danger'
                                    />
                                </div>
                            </div>
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
        </div>
    )
}

export default PersonaCreate;