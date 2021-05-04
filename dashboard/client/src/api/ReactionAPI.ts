import request, { Response } from "superagent";
import { Reactions } from "../reactions/Reactions";

const ReactionAPI = (
    url: string
) => ({
    get(
        received: (personas: Reactions) => void
    ): void {

    },

    put(): void {

    },

    remove(): void {
        
    }
});

export default ReactionAPI;