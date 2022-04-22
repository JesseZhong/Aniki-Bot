import React from 'react';
import { render } from '@testing-library/react';
import { MessageTree } from '../embeds/Message/MessageTree';
import { Emoji, Emojis } from '../emojis/Emojis';


const emojiUrl = 'https://all.paths.lead/to/funny/memes.gif';

const renderTree = (
    text: string
) => {
    const tree = new MessageTree(text);

    return render(<>{tree.render(new Emojis())}</>);
}

beforeAll(() => {

    // Mock emoji's lookup.
    jest.spyOn(
        Emojis.prototype,
        'emoji_lookup',
        'get'
    ).mockReturnValue(new Map<string, Emoji>([
        [
            'test-emote:123456',
            new Emoji({
                id: '123456',
                name: 'test-emote'
            })
        ],
        [
            'widePeepoHappy:7777777',
            new Emoji({
                id: '7777777',
                name: 'widePeepoHappy'
            })
        ]
    ]));

    // Mock the get emoji URL method.
    jest.spyOn(
        Emoji.prototype,
        'getEmojiUrl'
    ).mockReturnValue(emojiUrl);
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('should render plain text whole', () => {
    const text = 'This is a plain text sentence.';

    const { getByText } = renderTree(text);

    expect(getByText(text, { exact: true })).toHaveTextContent(text);
});

test('should render an image source as image', () => {
    const text = 'https://lets.pretend.this/is/a/real/image.png';

    const { getByRole } = renderTree(text);

    expect(getByRole('img').getAttribute('src')).toEqual(text);
});

test('should render non-image urls as hypertext', () => {
    const text = 'https://real.website.i/visit';

    const { getByRole } = renderTree(text);

    expect(getByRole('link').getAttribute('href')).toEqual(text);
    expect(getByRole('link').textContent).toEqual(text);
});

test('should render a recognized emoji', () => {
    const emojiName = 'widePeepoHappy';
    const emojiId = '7777777';

    const { getByRole } = renderTree(`<:${emojiName}:${emojiId}>`);

    const emoji = getByRole('img');

    expect(emoji.getAttribute('src')).toEqual(emojiUrl);
    expect(emoji.getAttribute('alt')).toEqual(`:${emojiName}:`);
    expect(emoji.getAttribute('data-emoji')).toEqual(emojiId);
});

test('should render text separated by line breaks as paragraphs', () => {
    const lines = [
        'This is the first line of text. Yup.',
        'This is the SECOND line. 🙃 TOGETHA!!',
        'Third line. Going all the way.',
        'Last line.'
    ];

    const { getAllByTestId } = renderTree(lines.join('\n'));

    const paragraphs = getAllByTestId('paragraph');

    expect(paragraphs.length).toEqual(lines.length);
    for (let i = 0; i < paragraphs.length; i++) {
        expect(paragraphs[i]).toHaveTextContent(lines[i]);
    }
})

test('should render all message parts correctly and in order', () => {

});