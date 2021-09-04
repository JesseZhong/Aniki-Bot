import React from 'react';
import './MediaCard.sass';

export type MediaType = 'youtube' | 'twitch' | 'reddit' | 'twitter' | 'other';

const MediaCard = (
    props: {
        source: MediaType,
        url: string,
        children?: React.ReactNode,
        className?: string
    }
) => {
    const source = props.source;
    const url = props.url;

    let edgeColor = 'black';
    let title = '';

    if (source === 'youtube') {
        edgeColor = '#FF0000';
        title = 'YouTube';
    }
    else if (source === 'twitch') {
        edgeColor = '#471a90';
        title = 'Twitch';
    }
    else if (source === 'reddit') {
        edgeColor = '#FF4500';
        title = 'Reddit'
    }
    else if (source === 'twitter') {
        edgeColor = '#1DA1F2';
        title = 'Twitter'
    }
    else {

    }

    return (
        <div
            className={
                'media-card d-flex flex-column' +
                (props.className ? ` ${props.className}` : '')
            }
            style={{
                borderLeft: `4px solid ${edgeColor}`
            }}
        >
            <span>
                {
                    title &&
                    <b style={{ fontSize: '1em' }}>
                        {` ${title}`}
                    </b>
                }
            </span>
            <a
                target='_blank'
                rel='noopener noreferrer'
                className='text-info mt-2 mb-3 overflow-hidden'
                href={url}
                style={{ fontSize: '0.8em' }}
            >
                {url}
            </a>
            {
                props.children && props.children
            }
        </div>
    );
}

export default MediaCard;