// src/models/authModels.ts

import z from "zod";
import { baseUser } from "./userModels";

export const registerUserModel = z.object({
  body: baseUser,
});

export type RegisterUserModel = z.infer<typeof registerUserModel>["body"];

export const loginUserModel = z.object({
  body: baseUser.pick({ email: true, password: true }),
});

export type LoginUserModel = z.infer<typeof loginUserModel>["body"];
