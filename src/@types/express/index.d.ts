import * as express from "express";

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
