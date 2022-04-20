import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
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
    const { url, width, className } = props;

    if (!url) {
        return (<></>);
    }

    let src = '';
    let title = '';

    const ytMatch = url.match(youtubeRegex);
    const twMatch = url.match(twitchRegex);

    // Check if it's a Youtube video.
    let ytid;
    if (ytMatch?.groups) {
        ytid = ytMatch.groups['id'];
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

    const height = width
        ? width * aspect_ratio
        : undefined;

    if (src || ytid) {
        return (
            <div
                className={
                    'd-flex justify-content-center video' +
                    (className ? ` ${className}` : '')
                }
            >
                {
                    ytid
                    ? <div
                        style={{
                            width: width,
                            minWidth: width,
                            height: height,
                            minHeight: height
                        }}
                    >
                        <LiteYouTubeEmbed
                            id={ytid}
                            title={title}
                            adNetwork={false}
                        />
                    </div>
                    : <iframe
                        loading='lazy'
                        width={width}
                        height={height}
                        className={className}
                        src={src}
                        title={title}
                        allowFullScreen
                    />
                }
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