import * as ls from 'local-storage';

const key = 'guild';

export interface GuildPreview {
    id: string;
    name: string;
    icon?: string;
}

export const Guild = {

    /**
     * Load in a guild from storage.
     * @param receive 
     */
    load: (
        receive: (guild: string) => void,
        error: () => void
    ) => {
        const guild = ls.get(key) as string;

        if (guild) {
            receive(guild);
        }
        else {
            error();
        }
    },

    /**
     * Save a guild to storage.
     * @param guild 
     */
    set: (guild: string) => {
        ls.set(key, guild);
    },

    /**
     * Remove a guild from storage.
     */
    remove: () => {
        ls.remove(key);
    }
}