import React from 'react';
import Avatar from '../common/Avatar';
import { Guild } from './Guild';


const GuildCard = (props: {
    guild: Guild
}) => {
    const guild = props.guild;

    return (
        <div>
            <Avatar
                src={guild.icon}
                alt={guild.name}
            />
            <span>
                {guild.name}
            </span>
        </div>
    );
}

export default GuildCard;