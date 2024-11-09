import { z } from "zod";
import { registerModel } from "./registerModel";
import { FiLock, FiMail } from "react-icons/fi";
import { FormFieldProps } from "../components/FormField";

export const loginModel = registerModel.pick({ email: true, password: true });
export type LoginModel = z.infer<typeof loginModel>;
export const loginFields: FormFieldProps[] = [
  {
    icon: FiMail,
    name: "email",
    type: "EMAIL",
    placeholder: "Email",
  },
  {
    icon: FiLock,
    name: "password",
    type: "PASSWORD",
    placeholder: "Password",
  },
];
