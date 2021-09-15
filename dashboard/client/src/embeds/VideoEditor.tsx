import React, { useState } from 'react';
import { TwoThumbInputRange } from 'react-two-thumb-input-range';
import Video from './Video';
import VolumeControl from './VolumeControl';
import './VideoEditor.sass'

const VideoEditor = (props: {
    video_url: string,
    width: number,
    clip_range?: [number, number],
    volume?: number,
    setClipRange: (value?: [number, number]) => void,
    setVolume: (value?: number) => void,
    className?: string
}) => {
    const resolution = 1000;
    const [clip, setClip] = useState(
        (
            props.clip_range?.map(
                c => c * resolution
            )
            ?? [0, resolution]
        ) as [number, number]
    );

    const url = props.video_url;

    let slideTop = 0.5;
    let slideLeft = '0';
    let slideShrink = '0';
    let trackColor = 'white';
    if (url) {
        if (url.match(/.*youtu.*/)) {
            slideTop = 0.52;
            slideLeft = '0.65em';
            slideShrink = '1.35em';
            trackColor = '#FF0000';
        }
        else if (url.match(/.*\.twitch\.tv.*/)) {
            slideTop = 0.50;
            slideLeft = '1.2em';
            slideShrink = '2.4em';
            trackColor = '#471a90';
        }
        else {
            return (<></>);
        }
    }
    else {
        return (<></>);
    }

    return (
        <div
            className={
                'd-flex flex-row video-clipper' +
                (props.className ? ` ${props.className}` : '')
            }
            style={{
                width: `${props.width}px`
            }}
        >
            <div className='d-flex flex-row'>
                <Video
                    className='my-2'
                    width={props.width}
                    url={props.video_url}
                />
                <div className='slider'>
                    <TwoThumbInputRange
                        min={0}
                        max={resolution}
                        values={clip}
                        onChange={(range: [number, number]) => {
                            setClip(range);
                            const adjusted = (range[0] === 0 && range[1] === resolution)
                                ? undefined
                                : range.map(c => c / resolution) as [number, number];
                            props.setClipRange(adjusted);
                        }}
                        showLabels={false}
                        inputStyle={{
                            width: `calc(${props.width}px - ${slideShrink})`,
                            height: '0.4em',
                            top: `${props.width * slideTop}px`,
                            left: slideLeft
                        }}
                        railColor='black'
                        trackColor={trackColor}
                        thumbColor={trackColor}
                    />
                </div>
            </div>
            <div className='ms-3 mb-3 d-flex flex-column justify-content-end'>
                <VolumeControl volume={props.volume ?? 100} />
            </div>
            
        </div>
    )
}

export default VideoEditor;