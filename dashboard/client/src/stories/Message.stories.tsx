import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Message from '../embeds/Message/Message';
import EmojiActions from '../actions/EmojiActions';
import { Form, Formik } from 'formik';
import { Emojis, Emoji, GuildEmojis } from '../emojis/Emojis';

export default {
    title: 'Embeds/Message',
    component: Message
} as ComponentMeta<typeof Message>;

const create = (
    content?: string
) => {

    // Load emojis for testing.
    React.useEffect(
        () => {
            EmojiActions.receive(new Emojis(
                [
                    [
                        '888380925535215686',
                        new GuildEmojis (
                            {
                                id: '888380925535215686',
                                name: 'Test Server'
                            },
                            [
                                new Emoji({
                                    id: '970910127819460608',
                                    name: 'ayayat',
                                    guild_id: '888380925535215686'
                                }),
                                new Emoji({
                                    id: '888385628096565248',
                                    name: 'peepojuicet',
                                    guild_id: '888380925535215686',
                                    animated: true
                                }),
                                new Emoji({
                                    id: '888385397183356940',
                                    name: 'winkt',
                                    guild_id: '888380925535215686'
                                })
                            ]
                        )
                    ]
                ]
            ));
        },
        []
    );

    return <Formik
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
}

export const Default: ComponentStory<typeof Message> = () => create();

export const WithContent: ComponentStory<typeof Message> = () => create('Hello this is fun.');