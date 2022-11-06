import { IModulesRequest } from "../../interfaces/modules";

export const validModuleMock: IModulesRequest = {
  groupId: "",
  name: "M 2",
  sprintPrefixName: "S",
};

export const modulewithInvalidGroupMock: IModulesRequest = {
  groupId: "734d5b6d-ddb3-463b-8726-689b49200dce",
  name: "M 2",
};

export const modulewithoutGroupMock: IModulesRequest = {
  groupId: "",
  name: "M 2",
};

export const modulewithoutNameMock: IModulesRequest = {
  groupId: "734d5b6d-ddb3-463b-8726-689b49200dce",
  name: "",
};
