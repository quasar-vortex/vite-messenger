import { z } from "zod";
import { FiLock, FiEye, FiUser, FiBell } from "react-icons/fi";
import { FormFieldProps } from "../components/FormField";

export const profileModel = z.object({
  bio: z.string().max(200).optional(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
      `Password must be between 8 and 16 characters long and 
    include at least one uppercase letter, one lowercase letter, one digit, 
    and one special character (e.g., @$!%*?&).`
    )
    .optional(),
  newPasword: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
      `Password must be between 8 and 16 characters long and 
    include at least one uppercase letter, one lowercase letter, one digit, 
    and one special character (e.g., @$!%*?&).`
    )
    .optional(),
  isVisible: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  userName: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*\d).{6,12}$/,
      "Your username can only include lowercase letters, one digit, and be between 6 and 12 characters long."
    ),
});
export type ProfileModel = z.infer<typeof profileModel>;

export const updateSettingsFields: FormFieldProps[] = [
  {
    icon: FiEye,
    name: "isVisible",
    type: "CHECKBOX",
  },
  {
    icon: FiBell,
    name: "notificationsEnabled",
    type: "CHECKBOX",
  },
];
export const updateBioFields: FormFieldProps[] = [
  {
    icon: FiUser,
    name: "bio",
    type: "TEXT",
    placeholder: "Write a bit about yourself...",
  },
];

export const updateUserNameFields: FormFieldProps[] = [
  {
    icon: FiUser,
    name: "userName",
    type: "TEXT",
    placeholder: "Enter a new user name",
  },
];

export const updatePasswordFields: FormFieldProps[] = [
  {
    icon: FiLock,
    name: "password",
    type: "PASSWORD",
    placeholder: "Enter your old password.",
  },
  {
    icon: FiLock,
    name: "newPassword",
    type: "PASSWORD",
    placeholder: "Enter a new Password",
  },
];
