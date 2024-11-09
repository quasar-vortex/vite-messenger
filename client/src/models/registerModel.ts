import z from "zod";
import { FormFieldProps } from "../components/FormField";

import { FiLock, FiMail, FiUser } from "react-icons/fi";
export const registerModel = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name must be at most 20 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(20, "Last name must be at most 20 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .max(50, "Email must be at most 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters")
    .max(16, "Confirm password must be at most 16 characters"),
  userName: z.string(),
});
export type RegisterModel = z.infer<typeof registerModel>;
export const registerFields: FormFieldProps[] = [
  {
    icon: FiUser,
    name: "firstName",
    type: "TEXT",
    placeholder: "First Name",
  },
  {
    icon: FiUser,
    name: "lastName",
    type: "TEXT",
    placeholder: "Last Name",
  },
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
  {
    icon: FiLock,
    name: "confirmPassword",
    type: "PASSWORD",
    placeholder: "Confirm Password",
  },
];
