import { IVideoMock } from "../../interfaces/videos";

export const validVideoMock: IVideoMock = {
	title: "video test 1",
	url: "test",
	releaseDate: "11/04/2022",
	sprintId: ""
}

export const validVideoMock2: IVideoMock = {
	title: "video test 2",
	url: "test2",
	releaseDate: "11/04/2022",
	sprintId: ""
}

export const videoWithoutTitleMock: IVideoMock = {
	title: "",
	url: "test 3",
	releaseDate: "11/04/2022",
	sprintId: ""
}

export const videoWithoutReleaseDateMock: IVideoMock = {
	title: "video test 4",
	url: "test 4",
	releaseDate: "11/04/2022",
	sprintId: ""
}

export const videoWithoutSprintMock: IVideoMock = {
	title: "video test 5",
	url: "test 5",
	releaseDate: "11/04/2022",
	sprintId: ""
}

export const videoWithInvalidSprintMock: IVideoMock = {
	title: "video test 6",
	url: "test 6",
	releaseDate: "11/04/2022",
	sprintId: "batata"
}