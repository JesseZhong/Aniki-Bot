import React from 'react';
import { render } from '@testing-library/react';
import Avatar from '../common/Avatar';


test('should display name initials if no image was provided', () => {
    const name = 'just random';

    const { getByText } = render(<Avatar name={name} />);

    expect(getByText(name[0], { exact: true })).toHaveTextContent(name[0]);
});

test('should display image if the source is provided', () => {
    const source = 'not/a/real/file.png';

    const { getByRole } = render(<Avatar src={source} />);

    expect(getByRole('img').getAttribute('src')).toEqual(source);
});