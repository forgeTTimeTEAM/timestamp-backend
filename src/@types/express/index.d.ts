import * as express from "express";
import { IVideoMarkerUpdade } from "../../interfaces/videoMarker";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        role: "STUDENT" | "ADM" | "INSTRUCTOR";
        groupId?: string;
      };
    }
  }
}
