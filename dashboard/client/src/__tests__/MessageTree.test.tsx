import React from 'react';
import { render } from '@testing-library/react';
import { MessageTree } from '../embeds/Message/MessageTree';
import { Emojis } from '../emojis/Emojis';


test('should render plain text whole', () => {
    const text = 'This is a plain text sentence.';

    const tree = new MessageTree(text);

    const { getByText } = render(<>{tree.render(new Emojis())}</>);

    expect(getByText(text, { exact: true })).toHaveTextContent(text);
});

test('should render an image source as image', () => {
    const source = 'https://lets.pretend.this/is/a/real/image.png';

    const tree = new MessageTree(source);

    const { getByRole } = render(<>{tree.render(new Emojis())}</>);

    expect(getByRole('img').getAttribute('src')).toEqual(source);
});

test('should render non-image urls as hypertext', () => {
    const link = 'https://real.website.i/visit';

    const tree = new MessageTree(link);

    const { getByRole } = render(<>{tree.render(new Emojis())}</>);

    expect(getByRole('link').getAttribute('href')).toEqual(link);
    expect(getByRole('link').textContent).toEqual(link);
});