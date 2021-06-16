import React from 'react';
import './Avatar.sass';

const Avatar = (props: {
    src: string,
    alt: string
}) => (
    <img
        className='avatar'
        src={props.src}
        alt={props.alt}
    />
)

export default Avatar;