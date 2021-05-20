import React from "react";
import { Reaction } from "../reactions/Reactions";
import Video from "./Video";
import './AudioCard.sass';


const AudioCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const audio = reaction.audio_url;

    let edgeColor = 'black';
    let audioSource = '';
    if (audio) {
        if (audio?.match(/.*youtu.*/)) {
            edgeColor = '#FF0000';
            audioSource = 'YouTube';
        }
        else if (audio?.match(/.*\.twitch\.tv.*/)) {
            edgeColor = '#471a90';
            audioSource = 'Twitch';
        }
    }

    return (
        <div
            className={
                'audio-card d-flex flex-column' +
                (props.className ? ` ${props.className}` : '')
            }
            style={{
                borderLeft: `4px solid ${edgeColor}`
            }}
        >
            <span>
                <b>Audio</b>
                {
                    audioSource &&
                    <span
                        style={{ fontSize: 'smaller' }}
                    >
                        {` (${audioSource})`}
                    </span>
                }
            </span>
            <a
                className='text-info mt-2 mb-3 overflow-hidden'
                href={audio}
            >
                {audio}
            </a>
            <div className='d-flex flex-row flex-wrap overflow-hidden'>
                <Video className='me-2' url={audio} width={400} />
                {
                    (reaction.start || reaction.end || reaction.volume) &&
                    <div className='audio-info d-flex flex-column'>
                        {
                            reaction.start &&
                            <span className='audio-setting mb-2'>
                                <b>Starts at </b>
                                <span className='text-success'>{reaction.start}</span>
                            </span>
                        }
                        {
                            reaction.end &&
                            <span className='audio-setting mb-2'>
                                <b>Ends at </b>
                                <span className='text-danger'>{reaction.end}</span>
                            </span>
                        }
                        {
                            reaction.volume &&
                            <span className='audio-setting'>
                                <b>Volume set to </b>
                                <span className='text-warning'>{reaction.volume * 100}%</span>
                            </span>
                        }
                    </div>
                    }
            </div>
        </div>
    )
}

export default AudioCard;