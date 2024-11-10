import z from "zod";

export const baseUserSelect = {
  userId: true,
  userName: true,
  email: true,
  firstName: true,
  lastName: true,
  isVisible: true,
  bio: true,
  notificationsEnabled: true,
  registeredAt: true,
};

export const otherUserSelect = {
  userId: true,
  userName: true,
  bio: true,
  avatarUrl: true,
};

export type BaseUser = z.infer<typeof baseUser>;

export const baseUser = z.object({
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
  password: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
    `Password must be between 8 and 16 characters long and 
include at least one uppercase letter, one lowercase letter, one digit, 
and one special character (e.g., @$!%*?&).`
  ),
  confirmPassword: z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,16}$/,
    `Password must be between 8 and 16 characters long and 
include at least one uppercase letter, one lowercase letter, one digit, 
and one special character (e.g., @$!%*?&).`
  ),
  userName: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*\d).{6,12}$/,
      "Your username can only include lowercase letters, one digit, and be between 6 and 12 characters long."
    ),
});

export const updateUserSchema = z.object({
  body: z.object({
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
    userName: baseUser.shape.userName.optional(),
  }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>["body"];

export const searchUsersQuerySchema = z.object({
  query: z.object({
    term: z.string().optional(),
    pageIndex: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : 1),
      z.number().min(1)
    ),
    pageSize: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : 10),
      z.number().min(1).max(100)
    ),
  }),
});

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>["query"];
