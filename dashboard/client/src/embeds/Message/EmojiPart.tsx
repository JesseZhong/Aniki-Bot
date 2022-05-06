import React from 'react';
import { getState } from '../../containers/AppContainer';
import { EmojiElement } from '../../slate';
import './EmojiPart.sass';


const EmojiPart = (
    props: {
        attributes: any,
        children: React.ReactNode,
        element: EmojiElement
    }
) => {
    const {
        attributes,
        children,
        element: {
            name,
            id
        }
    } = props;

    const emojis = getState().emojis;

    const emoji = emojis.emoji_lookup.get(`${name}:${id}`);

    console.log(emoji)

    return (
        emoji
        ? <img
            {...attributes}
            className='emoji'
            src={emoji.getEmojiUrl()}
            alt={name}
        />
        : <span>
            {children}
        </span>
    );
}

export default EmojiPart;