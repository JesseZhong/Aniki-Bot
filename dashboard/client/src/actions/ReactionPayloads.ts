import { ActionPayload } from "../AppDispatcher";
import { Reaction, Reactions } from "../reactions/Reactions";

export interface ReceiveReactionsPayload extends ActionPayload {
    reactions: Reactions
}

export interface PutReactionPayload extends ActionPayload {
    reaction: Reaction
}

export interface RemoveReactionPayload extends ActionPayload {
    reaction: Reaction
}