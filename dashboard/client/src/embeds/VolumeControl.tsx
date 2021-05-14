import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './VolumeControl.sass';
import { faVolumeDown, faVolumeOff, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const VolumeControl = (props: {
    volume: number
}) => {

    const [volume, setVolume] = useState(props.volume);
    const [sliderVis, setSliderVis] = useState(false);
    
    let icon = faVolumeOff;
    if (volume > 0.6) {
        icon = faVolumeUp;
    }
    else if (volume > 0) {
        icon = faVolumeDown;
    }

    return (
        <div
            className='volume-control d-flex flex-column justify-content-end'
            onMouseLeave={() => setSliderVis(false)}
        >
            <input
                className='mb-3'
                type='range'
                min={0}
                max={1}
                step={0.05}
                value={volume}
                hidden={!sliderVis}
                onChange={
                    (element: React.InputHTMLAttributes<HTMLInputElement>) => {
                        const value = element.value as number;
                        if (value) {
                            setVolume(value);
                        }
                    }
                }
            />
            <FontAwesomeIcon
                icon={icon}
                onMouseEnter={() => setSliderVis(true)}
            />
        </div>
    )
}

export default VolumeControl;