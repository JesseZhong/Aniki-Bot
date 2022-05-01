import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Message from '../embeds/Message/Message';
import { Form, Formik } from 'formik';

export default {
    title: 'Embeds/Message',
    component: Message
} as ComponentMeta<typeof Message>;

const create = (
    content?: string
) => <Formik
        initialValues={{
            message: content ?? ''
        }}
        onSubmit={() => {}}
    >
    {() => (
        <Form>
            <Message
                name='message'
            />  
        </Form>
    )}
</Formik>;

export const Default: ComponentStory<typeof Message> = () => create();

export const WithContent: ComponentStory<typeof Message> = () => create('Hello this is fun.');