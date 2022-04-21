import React from 'react';
import { render } from '@testing-library/react';
import GuildCard from '../guild/GuildCard';
import { Guild } from '../guild/Guild';


test('should display guild name', () => {
    const guildName = 'Test Guild Name';

    const { getByText } = render(<GuildCard guild={new Guild({
        name: guildName
    })} />);

    expect(getByText(guildName)).toHaveTextContent(guildName);
});

test('should display guild name first initial as avatar if guild doesn\'t have an icon', () => {
    const guildName = 'Scrappy Guild';

    const { getByText } = render(<GuildCard guild={new Guild({
        name: guildName
    })} />);

    expect(getByText(guildName[0], { exact: true })).toHaveTextContent(guildName[0]);
});