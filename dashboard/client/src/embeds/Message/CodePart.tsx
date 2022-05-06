import React from 'react';

const CodePart = (props: {
    attributes: any,
    children: React.ReactElement
}) => {
    const {
        attributes,
        children
    } = props;

    return (
        <pre {...attributes}>
            <code>{children}</code>
        </pre>
    )
}

export default CodePart;