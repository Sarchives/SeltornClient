export interface Info {
    id: string;
}

export interface User {
    id: string;
    token: string;
    email: string;
    password: string;
    username: string;
    discriminator: string;
    creation: number;
    verified: boolean;
    verificator: string;
};

export interface Friend {
    id: string;
    blocked: boolean;
}

export interface ReturnedUser {
    id: string;
    username: string;
    discriminator: string;
    creation: number;
};

export interface Member {
    id: string;
    username: string;
    discriminator: string;
    nickname?: string;
    roles: string[];
};

export interface Role {
    id: string,
    name: string;
    permissions: number;
    color?: string;
    hoist: boolean;
};

export interface Author {
    id: string;
    username: string;
    nickname?: string;
    discriminator: string;
};

export interface Message {
    id: string;
    author: Author;
    content: string;
    creation: number;
    ref: any;
};

export interface Channel {
    id: string;
    name: string;
    topic?: string;
    creation: number;
    roles: Role[];
    messages: Message[];
    pins: string[];
    ref: any;
};

export interface Invite {
    code: string;
    author: string | Author;
    expiration: number;
    maxUses: number;
    uses: number;
}

export interface Guild {
    id: string;
    name: string,
    description?: string,
    public: boolean,
    channels: Channel[],
    roles: Role[],
    members: Member[],
    bans: string[];
    invites: Invite[];
    ref: any;
};