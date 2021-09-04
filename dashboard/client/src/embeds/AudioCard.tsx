import React from "react";
import { Reaction } from "../reactions/Reactions";
import Video from "./Video";
import MediaCard, { MediaType } from "./MediaCard";
import './AudioCard.sass';


const AudioCard = (props: {
    reaction: Reaction,
    className?: string
}) => {
    const reaction = props.reaction;
    const audio = reaction.audio_url;

    let source: MediaType = 'other';
    if (audio) {
        if (audio?.match(/.*youtu.*/)) {
            source = 'youtube';
        }
        else if (audio?.match(/.*\.twitch\.tv.*/)) {
            source = 'twitch';
        }
    }
    else {
        return (<></>);
    }

    return (
        <MediaCard
            source={source}
            url={audio}
            className={props.className}
        >
            <div className='d-flex flex-row flex-wrap overflow-hidden'>
                <Video className='me-auto' url={audio} width={400} />
                {
                    (reaction.start || reaction.end || reaction.volume) &&
                    <div className='audio-info d-flex flex-column mt-2'>
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
        </MediaCard>
    )
}

export default AudioCard;