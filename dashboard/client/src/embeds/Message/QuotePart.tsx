import React from 'react';

const QuotePart = (props: {
    attributes: any,
    children: React.ReactElement
}) => {
    const {
        attributes,
        children
    } = props;

    return (
        <q {...attributes}>
            {children}
        </q>
    )
}

export default QuotePart;