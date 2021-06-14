import React, { useEffect, useState } from 'react';
import './HoverButtonGroup.sass';

const HoverButtonGroup = (props: {
    owner: React.RefObject<HTMLElement>,
    children?: React.ReactElement<HTMLButtonElement>[] | React.ReactElement<HTMLButtonElement>,
    style?: React.CSSProperties
}) => {
    const [hovered, setHovered] = useState(false);

    useEffect(
        () => {
            const owner = props.owner?.current;
            if (owner && setHovered) {
                owner.onmouseenter = () => setHovered(true);
                owner.onmouseleave = () => setHovered(false);
            }
            return () => {
                if (owner && setHovered) {
                    owner.onmouseenter = null;
                    owner.onmouseleave = null;
                }
            }
        },
        [props.owner]
    )

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