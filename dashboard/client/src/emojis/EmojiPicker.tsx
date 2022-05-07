import React from 'react';
import { getState } from '../containers/AppContainer';
import { Emoji, GuildEmojis } from './Emojis';
import { Guild } from '../guild/Guild';
import './EmojiPicker.sass';


// ex. <a:widePeepoHappy:887114394117480480>
export const emojiRegex = /^<[a-z0-9_]*:(?<name>[a-z0-9_]{2,}):(?<id>[0-9]+)>$/i;
export const ungroupedEmojiRegex = /(<[a-z0-9_]*:[a-z0-9_]{2,}:[0-9]+>)/i;


/**
 * Randomly picks an emoji from what is available in the emoji store.
 * @returns A random emoji's CDN URI.
 */
export const getRandomEmoji = (): string | null => {
    const emojis = getState().emojis;

    if (emojis.size < 1) {
        return null;
    }

    const index = Math.floor(Math.random() * emojis.emoji_list.length);
    const emoji = emojis.emoji_list[index];
    return emoji.getEmojiUrl();
}

/**
 * A panel that allows for picking Discord server emojis.
 * @returns The panel/picker.
 */
const EmojiPicker = (props: {
    onClick: (
        encodedEmoji: string,
        name: string,
        id: string
    ) => void
}) => {

    const emojis = getState().emojis;

    // Selected is the current emoji clicked or hovered over.
    const [selected, setSelected] = React.useState<string | null>(
        emojis.emoji_list.length > 0 ? emojis.emoji_list[0].name : null
    );
    const getSelected = () => {
        return selected ? emojis.emoji_lookup.get(selected) : null;
    }

    /**
     * Displays the guild icon if available, or a default icon with the guild's first initial.
     * @param guild Guild info/preview.
     * @param onClick Optional execution code if the icon is clicked.
     * @returns Guild icon.
     */
    const guildIcon = (
        guild: GuildEmojis | Guild,
        onClick?: React.MouseEventHandler<HTMLDivElement>
    ) => {
        const guildIconUrl = guild.getIconUrl();

        return (
            <div
                key={guild.id}
                className='guild-icon jar'
                onClick={onClick}
            >
                {
                    guildIconUrl
                    ? <img
                        src={guildIconUrl}
                        alt={guild.name}
                    />
                    : <div>
                        {guild?.name?.[0]}
                    </div>
                }
            </div>
        );
    }

    /**
     * Lists out all the emojis on the right pane of the picker, sorted by their guild.
     * @param gEmojis Emojis grouped with their guild info/preview.
     * @returns A selectable list of emojis.
     */
    const guildEmojis = (
        gEmojis: GuildEmojis
    ) =>
    <div
        key={gEmojis.id}
        className='emoji-group d-flex flex-column'
    >
        <div className='guild-divider d-flex flex-row mt-2 mb-1'>
            {guildIcon(gEmojis)}
            <span className='ms-1'>
                {gEmojis.name}
            </span>
        </div>
        <div className='d-flex flex-row'>
        {
            gEmojis.emojis &&
            gEmojis.emojis.map(
                (emoji: Emoji) => {
                    const isSelected = emoji.name === selected;

                    return <div
                        key={emoji.id}
                        className={'emoji' + (isSelected ? ' selected' : '')}
                        onMouseEnter={
                            (event: React.MouseEvent<HTMLDivElement>) => {
                                if (event) {
                                    setSelected(emoji.name);
                                }
                            }
                        }
                        onClick={() => props.onClick(
                            `<:${emoji.name}:${emoji.id}>`,
                            emoji.name,
                            emoji.id
                        )}
                    >
                        {emoji.render()}
                    </div>;
                }  
            )
        }
        </div>
    </div>;

    /**
     * Creates and the emoji box at the bottom of the selection picker window.
     * @returns Emoji and guild info box.
     */
    const displayEmojiInfo = () => {
        const selected = getSelected();
        if (!selected || !selected.guild_id) {
            return <></>;
        }
        
        const name = selected.name;
        const guild = emojis.guild_lookup.get(selected.guild_id);

        return (
            <div className='emoji-info d-flex flex-row justify-content-between my-1'>
                <div className='d-flex flex-row ms-2'>
                    <div className='emoji d-flex flex-column justify-content-center me-2'>
                        <img
                            src={selected.getEmojiUrl()}
                            alt={name}
                        />
                    </div>
                    <div className='d-flex flex-column'>
                        <span className='name'>
                            {`:${name}:`}
                        </span>
                        <span className='server'>
                            {'from '}
                            <span>
                                {guild?.name}
                            </span>
                        </span>
                    </div>
                </div>
                <div className='d-flex flex-column justify-content-center me-2'>
                    {
                        guild && guild.name && guild.id
                        ? guildIcon(guild)
                        : <></>
                    }
                </div>
            </div>
        );
    }

    return (
        <div className='emoji-picker d-flex flex-row'>
            <div className='guild-nav d-flex flex-column flex-nowrap'>
                {
                    emojis.guild_emoji_list &&
                    emojis.guild_emoji_list.map(guild => guildIcon(guild))
                }
            </div>
            <div className='emoji-panel d-flex flex-column'>
                {
                    emojis.guild_emoji_list &&
                    emojis.guild_emoji_list.map(guildEmojis)
                }
                {displayEmojiInfo()}
            </div>
        </div>
    )
}

export default EmojiPicker;