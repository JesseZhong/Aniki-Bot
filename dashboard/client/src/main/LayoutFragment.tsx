import React from 'react';
import { Guild } from '../guild/Guild';
import { Outlet } from 'react-router';
import GuildCard from '../guild/GuildCard';


const LayoutFragment = (props: {
    guild: Guild
}) => (
    <div
        style={{
            position: 'relative'
        }}
    >
        <GuildCard
            guild={props.guild}
            style={{
                position: 'absolute',
                right: '2em',
                top: 0
            }}
        />
        <Outlet />
    </div>
);

export default LayoutFragment;