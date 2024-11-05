import z from "zod";

export const baseUserSelect = {
  userId: true,
  userName: true,
  email: true,
  firstName: true,
  lastName: true,
  avatar: true,
  isVisible: true,
  lastActive: true,
  bio: true,
  notificationsEnabled: true,
  registeredAt: true,
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

export const updateUserSchema = z.object({
  body: z.object({
    bio: z.string().max(200).optional(),
    avatarFileId: z.string().max(36).optional(),
    password: z.string().min(8).max(16).optional(),
    isVisible: z.boolean().optional(),
    notificationsEnabled: z.boolean().optional(),
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
