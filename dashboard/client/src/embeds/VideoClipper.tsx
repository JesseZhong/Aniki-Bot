import { useState } from 'react';
import { TwoThumbInputRange } from 'react-two-thumb-input-range';

const toSeconds = (formattedTime: string) => {
    const [hours, minutes, seconds] = formattedTime
        .split(':')
        .map(f => parseInt(f));
    return (hours * 3600) + (minutes * 60) + seconds;
}

const toFormatted = (secs: number) => {
    const hours = `${secs / 3600}`.padStart(2, '0');
    const minutes = `${(secs % 3600) / 60}`.padStart(2, '0');
    const seconds = `${secs % 60}`.padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const VideoClipper = (props: {
    start?: string,
    end?: string,
    min: number,
    max: number,
    set: (start: string, end: string) => void,
    className?: string
}) => {

    const start = props.start
        ? toSeconds(props.start)
        : props.min;
    const end = props.end
        ? toSeconds(props.end)
        : props.max;

    const [clip, setClip] = useState([start, end] as [number, number]);

    return (
        <TwoThumbInputRange
            min={props.min}
            max={props.max}
            values={clip}
            onChange={([newStart, newEnd]) => {
                setClip([newStart, newEnd]);

                props.set(
                    toFormatted(newStart),
                    toFormatted(newEnd)
                );
            }}
        />
    )
}

export default VideoClipper;