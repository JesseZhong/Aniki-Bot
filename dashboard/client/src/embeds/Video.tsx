import React from 'react';

const Video = (
    props: {
        url: string,
        width?: string,
        height?: string,
        className?: string
    }
) => {
    const PARENT_DOMAIN = process.env.REACT_APP_SITE_DOMAIN;
    const url = props.url;
    let src = '';
    let title = '';

    const ytMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<id>[^"&?/\s]{11})/);
    const twMatch = url.match(/^https:\/\/www\.twitch\.tv\/(?<channel>[a-zA-Z0-9_]{4,25})\/clip\/(?<clip>[a-zA-Z0-9-]*)(?:$|\?.*$)/);

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
            <div>
                <iframe
                    width={props.width}
                    height={props.height}
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
            <span className='text-danger ml-1'>
                Unsupported Video
            </span>
        )
    }
}

export default Video;