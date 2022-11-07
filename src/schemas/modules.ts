import * as yup from "yup";
import { IModuleRequest } from "../interfaces/modules";

export const createModuleSchema: yup.SchemaOf<IModuleRequest> = yup
  .object()
  .shape({
    groupId: yup.string().required().uuid(),
    name: yup.string().required(),
    sprintPrefixName: yup.string().notRequired(),
  });
