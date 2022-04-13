import React from 'react';
import Avatar from '../common/Avatar';
import { Guild } from './Guild';
import './GuildCard.sass';


const GuildCard = (props: {
    guild: Guild,
    style?: React.CSSProperties
}) => {
    const { guild, style } = props;

    return (
        <div
            className='guild-card d-flex flex-row align-items-center'
            style={style}
        >
            <Avatar
                src={guild.getIconUrl()}
                name={guild.name}
                size='2em'
            />
            <span className='ms-2'>
                {guild.name}
            </span>
        </div>
    );
}

export default GuildCard;