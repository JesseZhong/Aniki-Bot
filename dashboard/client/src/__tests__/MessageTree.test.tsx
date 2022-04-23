import React from 'react';
import { render } from '@testing-library/react';
import { MessageTree } from '../embeds/Message/MessageTree';
import { Emoji, Emojis } from '../emojis/Emojis';


const msgPartKey = 'message-part';
const emojiUrl = 'https://all.paths.lead/to/funny/memes.gif';

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
                name: 'test_emote'
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

const renderTree = (
    text: string
) => {
    const tree = new MessageTree(text);

    return render(<>{tree.render(new Emojis())}</>);
}

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
    const text = '<:test_emote:123456>Hi frands! <:widePeepoHappy:7777777> Welcome.\nhttps://twatch.tb\nHere\'s a funny meme: https://img.nicememe.com/happy.gif';

    const { getAllByTestId } = renderTree(text);

    const parts = getAllByTestId(msgPartKey);

    expect(parts.length).toEqual(7);

    const assertType = (index: number, type: string) => {
        expect(parts[index].getAttribute('data-text-type')).toEqual(type);
    }

    // Emote: <:test_emote:123456>
    assertType(0, 'emoji');

    // Text: 'Hi frands! '
    assertType(1, 'text');

    // Emote: <:widePeepoHappy:7777777>
    assertType(2, 'emoji');

    // Text: ' Welcome.'
    assertType(3, 'text');

    // Link: 'https://twatch.tb'
    assertType(4, 'link');

    // Text: "Here's a funny meme: "
    assertType(5, 'text');

    // Image: 'https://img.nicememe.com/happy.gif'
    assertType(6, 'image');
});


const treeRerender = (
    ui: JSX.Element
) => {
    const prerender = render(ui);

    const tree = new MessageTree();

    tree.parse(prerender.container.childNodes);

    // Clear the prerender from the DOM.
    prerender.unmount();

    return render(<>{tree.render(new Emojis())}</>);
}

test('should rerender plain text properly', () => {
    const text = 'Perfectly safe.';

    const { getAllByTestId } = treeRerender(<>{text}</>);

    const parts = getAllByTestId(msgPartKey);

    expect(parts.length).toEqual(1);
    expect(parts[0]).toHaveTextContent(text);
});

test('should rerender an image properly', () => {
    const source = 'https://happy.joyjoy.we/yup.gif';

    const { getByRole, getAllByTestId } = treeRerender(<img src={source} />);

    expect(getAllByTestId(msgPartKey).length).toEqual(1);
    expect(getByRole('img').getAttribute('src')).toEqual(source);
});

test('should rerender image URLs as images', () => {
    const text = 'https://arr.canu.hear/me.jpeg';

    const { getByRole, getAllByTestId } = treeRerender(<>{text}</>);

    expect(getAllByTestId(msgPartKey).length).toEqual(1);
    expect(getByRole('img').getAttribute('src')).toEqual(text);
})

test('should rerender non-image URLs as links', () => {
    const link1 = 'https://help.me.pls';
    const link2 = 'http://thx.m8.pog/yeet';

    const { getAllByRole, getAllByTestId } = treeRerender(<>{link1} {link2}</>);

    const links = getAllByRole('link');

    expect(getAllByTestId(msgPartKey).length).toEqual(3); // Extra text part for the space between the links.
    expect(links[0].getAttribute('href')).toEqual(link1);
    expect(links[0].textContent).toEqual(link1);
    expect(links[1].getAttribute('href')).toEqual(link2);
    expect(links[1].textContent).toEqual(link2);
});

test('should rerender emojis properly', () => {
    const emojiName = 'widePeepoHappy';
    const emojiId = '7777777';

    const { getByRole, getAllByTestId } = treeRerender(<img
        src={emojiUrl}
        alt={`:${emojiName}:`}
        data-emoji={emojiId}
    />);

    const image = getByRole('img');

    const testImage = (
        attribute: string,
        expected: string
    ) => {
        expect(image.getAttribute(attribute)).toEqual(expected);
    }

    expect(getAllByTestId(msgPartKey).length).toEqual(1);
    testImage('src', emojiUrl);
    testImage('alt', `:${emojiName}:`);
    testImage('data-emoji', emojiId);
});

test('should rerender paragraphs properly', () => {
    const { getAllByTestId } = treeRerender(<>
        <p>something</p>
        <p></p>
        <p></p>
        <p>Really not important...</p>
        <p>HEY LISTEN!</p>
    </>);

    expect(getAllByTestId('paragraph').length).toEqual(5);
});

test('should rerender produceable nodes similar to the original', () => {

    const { getAllByRole, getAllByTestId } = treeRerender(<>
        <span>Aww shucks</span><span> this is on the same line.</span>
        <p>
            <span>I honestly hope this turns out okay. Go here: https://visit.me.please</span>
            <span>
                Let's goooooooooo!!
                <img
                    src={emojiUrl}
                    alt=':widePeepoHappy:'
                    data-emoji='7777777'
                />
                Yups!
            </span>
        </p>
        Forreal why am I still doing this???
        <img src='http://yupyupyup.gif' />
    </>);

    expect(getAllByRole('img').length).toEqual(2);
    expect(getAllByRole('link').length).toEqual(1);
    expect(getAllByTestId('paragraph').length).toEqual(3);
    expect(getAllByTestId(msgPartKey).length).toEqual(8);
});