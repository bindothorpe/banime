import {Response} from './response';

export interface ServerResponse extends Response<ServerData> {}

export interface ServerData {
    sub: Server[];
    dub: Server[];
    raw: Server[];
    episodeId: string;
    episodeNo: number;
}

export interface Server {
    serverName: string;
    serverId: number;
}