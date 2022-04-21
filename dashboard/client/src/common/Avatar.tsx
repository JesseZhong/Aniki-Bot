import React from 'react';
import './Avatar.sass';

const Avatar = (props: {
    src?: string,
    name?: string
    size?: string
}) => {
    const { src, name, size } = props;

    const diameter = size ?? '4em'

    const style = {
        width: diameter,
        minWidth: diameter,
        height: diameter,
        minHeight: diameter
    };

    return (
        src
        ? <img
            className='avatar'
            src={src}
            alt={name ?? 'avatar'}
            style={style}
        />
        : <span
            className='avatar'
            style={style}
        >
            {name?.[0] ?? ''}
        </span>
    );
    }

export default Avatar;