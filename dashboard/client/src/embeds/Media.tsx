import React from 'react';
import { FetchMetadataHandler, Metadata } from '../api/Metadata';
import { getState } from '../containers/AppContainer';
import MediaCard, { MediaType } from './MediaCard';
import Video, { videoRegex } from './Video';

const imageRegex = /(https{0,1}:\/\/[^\s]+\.(?:gif|jp[e]{0,1}g|webm|webp|png|svg)[^\s]*)/;
const redditRegex = /(https{0,1}:\/\/(www\.|)reddit\.com[^\s]*)/;
const twitterRegex = /^/;
export const mediaRegex = /(https{0,1}:\/\/[^\s]*)/;

const Media = (
    props: {
        url: string,
        width?: number,
        className?: string,
        caption?: boolean
    }
) => {

    const [metadata, setMetadata] = React.useState<Metadata | undefined>();
    const [retreiving, setRetreiving] = React.useState<boolean>(false);

    const url = props.url;
    if (!url) {
        return (<></>);
    }

    if (imageRegex.test(url)) {
        if (props.caption) {
            return <figure className={props.className}>
                <figcaption>{url}</figcaption>
                <img
                    src={url}
                    alt={url}
                    width={props.width}
                />
            </figure>;
        }
        else {
            return <img
                src={url}
                alt={url}
                width={props.width}
            />;
        }
    }
    else {
        let content: React.ReactNode;
        let source: MediaType = 'other';

        if (videoRegex.test(url)) {
            if (url?.match(/.*youtu.*/)) {
                source = 'youtube';
            }
            else if (url?.match(/.*\.twitch\.tv.*/)) {
                source = 'twitch';
            }

            content = <Video
                url={url}
                width={props.width ?? 400}
                className='me-auto'
            />;
        }
        else {
            // Fetch site metadata.
            if (!retreiving) {
                getState().fetchMetadata(
                    url,
                    (meta: Metadata) => {
                        console.log(meta)
                        setMetadata(meta);
                    }
                )
                setRetreiving(true);
            }

            content = <div>
                <img
                    src={metadata?.['og:image']}
                />
            </div>;

            if (redditRegex.test(url)) {
                source = 'reddit';
            }
            else if (twitterRegex.test(url)) {
                source = 'twitter';
            }
            else {
                // TODO: All other sites.
            }
        }

        if (content) {
            return <MediaCard
                source={source}
                url={url}
                className={props.className}
            >
                {content}
            </MediaCard>;
        }
        else {
            return <></>;
        }
    }
}

export default Media;