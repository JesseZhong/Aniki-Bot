import React from 'react';
import './Video.sass';

const aspect_ratio = 0.5625;

export const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<id>[^"&?/\s]{11})/;
export const twitchRegex = /^https:\/\/www\.twitch\.tv\/(?<channel>[a-zA-Z0-9_]{4,25})\/clip\/(?<clip>[a-zA-Z0-9-]*)(?:$|\?.*$)/;

export const videoRegex = new RegExp(`${youtubeRegex.source}|${twitchRegex.source}`);

const Video = (
    props: {
        url: string,
        width?: number,
        className?: string
    }
) => {
    const PARENT_DOMAIN = process.env.REACT_APP_SITE_DOMAIN;
    const url = props.url;
    if (!url) {
        return (<></>);
    }

    let src = '';
    let title = '';

    const ytMatch = url.match(youtubeRegex);
    const twMatch = url.match(twitchRegex);

    // Check if it's a Youtube video.
    if (ytMatch?.groups) {
        const id = ytMatch.groups['id'];
        if (id) {
            src = `https://www.youtube.com/embed/${id}`;
            title = id;
        }
    }

    // Check if it's a Twitch clip.
    else if(twMatch?.groups) {
        //const channel = twMatch.groups['channel'];
        const clip = twMatch.groups['clip'];
        if (clip && PARENT_DOMAIN) {
            src = `https://clips.twitch.tv/embed?clip=${clip}&parent=${PARENT_DOMAIN}`;
            title = clip;
        }
    }

    if (src) {
        return (
            <div
                className={
                    'd-flex justify-content-center video' +
                    (props.className ? ` ${props.className}` : '')
                }
            >
                <iframe
                    width={props.width}
                    height={
                        props.width
                        ? props.width * aspect_ratio
                        : undefined
                    }
                    className={props.className}
                    src={src}
                    title={title}
                    allowFullScreen
                />
            </div>
        )
    }
    else {
        return (
            <span className='text-danger ms-1'>
                Unsupported Video
            </span>
        )
    }
}

export default Video;