import { BaseEditor, Descendant } from 'slate';
import { ReactEditor } from 'slate-react';

type MessageText = {
    text: string;
}

type BaseElement = {
    children: MessageText[];
}

type DefaultElement = {
    type: 'paragraph' | 'code';
} & BaseElement;

type ImageElement = {
    type: 'image';
    url: string;
} & BaseElement;

type EmojiElement = {
    type: 'emoji';
    name: string;
    id: string;
} & BaseElement;

type MessageElement = DefaultElement | ImageElement | EmojiElement;

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor,
        Element: MessageElement,
        Text: MessageText
    }
}