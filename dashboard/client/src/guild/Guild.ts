const cdnUrl = 'https://cdn.discordapp.com';

export class Guild {

    constructor(
        guild?: {
            id?: string,
            name?: string,
            icon?: string
        }
    ) {
        if (guild) {
            ({
                id: this.id,
                name: this.name,
                icon: this.icon
            } = guild);
        }
    }

    public id?: string;
    public name?: string;
    public icon?: string;

    public getIconUrl (): string | undefined {
        if (!this.id || !this.icon) {
            return undefined;
        }

        // Docs: https://discord.com/developers/docs/reference#image-formatting
        // 'In the case of endpoints that support GIFs, the hash will begin with a_ if it is available in GIF format. (example: a_1269e74af4df7417b13759eae50c83dc)"'
        const animated = /^a_.*/.test(this.icon);
        return `${cdnUrl}/icons/${this.id}/${this.icon}.${(animated ? 'gif' : 'png')}`;
    }
}