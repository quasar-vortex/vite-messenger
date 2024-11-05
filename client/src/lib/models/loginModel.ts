import { z } from "zod";
import { registerModel } from "./registerModel";

export const loginModel = registerModel.pick({ email: true, password: true });
export type LoginModel = z.infer<typeof loginModel>;
