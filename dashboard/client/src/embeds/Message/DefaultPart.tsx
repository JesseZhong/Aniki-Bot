import React from 'react';

const DefaultPart = (props: {
    attributes: any,
    children: React.ReactNode
}) => {
    const {
        attributes,
        children
    } = props;

    return (
        <p {...attributes}>
            {children}
        </p>
    )
}

export default DefaultPart;