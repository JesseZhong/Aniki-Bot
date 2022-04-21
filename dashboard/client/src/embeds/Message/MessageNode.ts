export enum MessageNodeType {
    TEXT = 1,
    MEDIA,
    EMOJI,
    PARAGRAPH,
    ROOT
}

export class MessageNode {
    constructor(
        node?: {
            type: MessageNodeType,
            children?: MessageNode[],
            rawText?: string
        }
    ) {
        if (node) {
            ({
                type: this.type,
                children: this.children,
                rawText: this.rawText
            } = node);
        }
        else {
            this.type = MessageNodeType.TEXT;
        }
    }

    public type: MessageNodeType;
    public children?: MessageNode[];
    public rawText?: string;
}