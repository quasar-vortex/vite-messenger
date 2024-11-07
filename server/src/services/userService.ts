import { db } from "../config/db";
import HttpError from "../config/httpError";
import {
  baseUserSelect,
  otherUserSelect,
  UpdateUserSchema,
} from "../models/userModels";
import { hashPassword } from "../utils/authUtils";

export const updateUserHandler = async (
  userId: string,
  data: UpdateUserSchema
) => {
  const { bio, isVisible, notificationsEnabled, password, newPasword } = data;

  const updatePayload: Omit<
    Partial<UpdateUserSchema>,
    "password" | "newPassword"
  > & { passwordHash?: string } = {};
  // Password Required if updating to new password
  if (newPasword && !password)
    throw new HttpError({
      status: "BAD_REQUEST",
      message: "Old password is required when updating to a new password",
    });
  // Check if the user exists
  const foundUser = await db.user.findUnique({
    where: { userId },
  });
  // If user doesn't exist throw error
  if (!foundUser) {
    throw new HttpError({
      status: "FORBIDDEN",
      message: "User not found",
    });
  }
  // if new password add to update
  if (newPasword && password)
    updatePayload.passwordHash = await hashPassword(newPasword);
  if (bio) updatePayload.bio = bio;
  if (isVisible !== undefined) updatePayload.isVisible = isVisible;
  if (notificationsEnabled !== undefined)
    updatePayload.notificationsEnabled = notificationsEnabled;
  // Update user in database
  const updatedUser = await db.user.update({
    where: { userId },
    data: updatePayload,
    select: { ...baseUserSelect, avatarFile: true },
  });
  return updatedUser;
};
export const getSignedInUserHandler = async (userId: string) => {
  // Find user in DB
  const foundUser = await db.user.findUnique({
    where: { userId },

    select: { ...baseUserSelect, avatarFile: true },
  });
  if (!foundUser) {
    throw new HttpError({
      status: "FORBIDDEN",
      message: "User not found",
    });
  }
  return foundUser;
};
export const getUserByIdHandler = async (userId: string) => {
  // Find the user
  const foundUser = await db.user.findUnique({
    where: { userId },
    select: { ...baseUserSelect, avatarFile: true },
  });
  if (!foundUser) {
    throw new HttpError({
      status: "NOT_FOUND",
      message: "User not found",
    });
  }
  const { avatarFile, ...restOfUser } = foundUser;
  const avatarUrl = avatarFile?.url || null;
  // Return avatar url and basic user info
  const payload = {
    avatarUrl,
    bio: restOfUser.bio,
    userId: restOfUser.userId,
    userName: restOfUser.userName,
  };
  return payload;
};
export const getSignedInUserFriendsHandler = async (signedInUserId: string) => {
  const friends = await db.friend.findMany({
    where: {
      OR: [{ senderId: signedInUserId }, { receiverId: signedInUserId }],
    },
    include: {
      sender: { include: { avatarFile: true } },
      receiver: { include: { avatarFile: true } },
    },
  });

  return friends.map((friend) => {
    // Check if signed in user is the sender
    let isSender = friend.senderId === signedInUserId;
    // Get the other user (receiver or sender)
    const { userName, userId, avatarFile, bio } =
      friend[isSender ? "receiver" : "sender"];
    // Get avatar if available
    const avatarUrl = avatarFile?.url || null;
    const payload = {
      userId,
      userName,
      bio,
      avatarUrl,
    };
    return payload;
  });
};
