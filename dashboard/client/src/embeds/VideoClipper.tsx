import React, { useState } from 'react';
import { TwoThumbInputRange } from 'react-two-thumb-input-range';
import Video from './Video';

const VideoClipper = (props: {
    video_url: string,
    width?: number,
    clip_range?: [number, number],
    set: (value?: [number, number]) => void,
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

    return (
        <div
            className={
                'd-flex flex-column' +
                (props.className ? ` ${props.className}` : '')
            }
        >
            <Video
                className='my-2 edit-view'
                width={props.width}
                url={props.video_url}
            />
            <TwoThumbInputRange
                min={0}
                max={resolution}
                values={clip}
                onChange={(range: [number, number]) => {
                    setClip(range);
                    const adjusted = (range[0] === 0 && range[1] === resolution)
                        ? undefined
                        : range.map(c => c / resolution) as [number, number];
                    props.set(adjusted);
                }}
                showLabels={false}
                inputStyle={
                    props.width ? { width: `${props.width}px` } : undefined
                }
            />
        </div>
    )
}

export default VideoClipper;