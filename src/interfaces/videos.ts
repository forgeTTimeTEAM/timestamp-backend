import { Role } from "./users";

export interface IVideoRequest {
    title: string;
    url: string | null;
    releaseDate: Date;
    sprintId: string;
}

export interface IVideoMock {
    title: string;
    url: string | null;
    releaseDate: string;
    sprintId: string;
}

export interface IVideoUpdateMock {
    title?: string;
    url?: string;
    sprintId?: string;
}

export interface IVideoCreateParams {
    video: IVideoRequest;
    groupId: string;
    userRole: Role;
}

export interface IVideoUpdateParams {
    videoId: string;
    video: IVideoRequest;
    groupId: string;
    userRole: Role;
}
