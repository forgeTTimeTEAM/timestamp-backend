import { IModuleRequest } from "../../interfaces/modules";

export const validModuleMock: IModuleRequest = {
  groupId: "",
  name: "M 2",
  sprintPrefixName: "S",
};

export const modulewithInvalidGroupMock: IModuleRequest = {
  groupId: "734d5b6d-ddb3-463b-8726-689b49200dce",
  name: "M 2",
};

export const modulewithoutGroupMock: IModuleRequest = {
  groupId: "",
  name: "M 2",
};

export const modulewithoutNameMock: IModuleRequest = {
  groupId: "734d5b6d-ddb3-463b-8726-689b49200dce",
  name: "",
};
