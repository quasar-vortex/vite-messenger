export type User = {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  userId: string;
  bio: string | null;
  registeredAt: Date;
  notificationsEnabled: boolean;
  isVisible: boolean;
  avatar: never;
  lastActive: never;
};
