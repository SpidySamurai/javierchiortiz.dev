export interface LanyardUser {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    display_name?: string;
    global_name?: string;
    public_flags?: number;
    avatar_decoration_data?: {
        asset: string;
        sku_id: string;
    };
    primary_guild?: {
        badge: string;
        identity_enabled: boolean;
        identity_guild_id: string;
        tag: string;
    };
}

export interface LanyardActivity {
    type: number;
    state: string;
    name: string;
    id: string;
    application_id?: string;
    emoji?: { name: string; id?: string; animated?: boolean };
    created_at: number;
    timestamps?: { start: number; end?: number };
    details?: string;
    assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
    };
}

export interface LanyardSpotify {
    track_id: string;
    timestamps: { start: number; end: number };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
}

export interface LanyardData {
    spotify: LanyardSpotify | null;
    kv: Record<string, string>;
    listening_to_spotify: boolean;
    discord_user: LanyardUser;
    discord_status: 'online' | 'idle' | 'dnd' | 'offline';
    activities: LanyardActivity[];
    active_on_discord_web: boolean;
    active_on_discord_desktop: boolean;
    active_on_discord_mobile: boolean;
}

export interface LanyardResponse {
    success: boolean;
    data: LanyardData;
}
