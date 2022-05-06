import { Editor, Transforms } from 'slate';
import { EmojiElement, ImageElement, MessageElement } from '../../slate';


export const withMedia = (
    editor: Editor
) => {
    const {
        isVoid,
        insertData
    } = editor;

    editor.isVoid = (
        element: MessageElement
    ) => {
        return element.type === 'emoji' || element.type === 'image'
            ? true
            : isVoid(element);
    }

    editor.insertData = (
        data: DataTransfer
    ) => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener(
                        'load',
                        () => {
                            const url = reader.result as string;
                            insertImage(editor, url);
                        }
                    );

                    reader.readAsDataURL(file);
                }
            }
        }
    }

    return editor;
}

export const insertImage = (
    editor: Editor,
    url: string
) => {
    const image: ImageElement = {
        type: 'image',
        url: url,
        children: [{ text: '' }]
    }

    Transforms.insertNodes(editor, image);
}

export const insertEmoji = (
    editor: Editor,
    name: string,
    id: string
) => {
    const emoji: EmojiElement = {
        type: 'emoji',
        name: name,
        id: id,
        children: [{ text: '' }]
    }

    Transforms.insertNodes(editor, emoji);
}