import React, { useEffect, useState } from 'react';
import './HoverButtonGroup.sass';

const HoverButtonGroup = (props: {
    owner: React.RefObject<HTMLElement>,
    children?: React.ReactElement<HTMLButtonElement>[] | React.ReactElement<HTMLButtonElement>,
    style?: React.CSSProperties
}) => {
    useEffect(
        () => {
            const owner = props.owner?.current;
            if (owner) {
                owner.onmouseenter = () => setHovered(true);
                owner.onmouseleave = () => setHovered(false);
            }
        },
        [props.owner]
    )

    const [hovered, setHovered] = useState(false);

    return (
        <>
        {
            hovered &&
            <div
                className='hover-btn-group btn-group'
                style={{
                    ...{
                        top: '-1em',
                        right: '1em'
                    },
                    ...props.style
                }}
            >
                {props.children}
            </div>
        }
        </>
    )
}

export default HoverButtonGroup;