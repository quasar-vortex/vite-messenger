import { User } from "@prisma/client";
import { db } from "../config/db";
import HttpError from "../config/httpError";
import logger from "../config/logger";
import {
  baseUserSelect,
  otherUserSelect,
  UpdateUserSchema,
} from "../models/userModels";
import { hashPassword } from "../utils/authUtils";
import { deleteObject, S3StorageFile } from "../utils/uploadUtils";

export const updateUserHandler = async (
  userId: string,
  data: UpdateUserSchema
) => {
  logger.info("User Update Started");
  const { bio, isVisible, notificationsEnabled, password, newPasword } = data;

  const updatePayload: Omit<
    Partial<UpdateUserSchema>,
    "password" | "newPassword"
  > & { passwordHash?: string } = {};
  // Password Required if updating to new password
  if (newPasword && !password) {
    logger.error("User atttempted to update password without providing old.", {
      userId,
    });
    throw new HttpError({
      status: "BAD_REQUEST",
      message: "Old password is required when updating to a new password",
    });
  }
  // Check if the user exists
  const foundUser = await db.user.findUnique({
    where: { userId },
  });
  // If user doesn't exist throw error
  if (!foundUser) {
    logger.error("Unable to update user. User not found.", { userId });
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
  const { avatarFile, ...restOfUser } = updatedUser;
  const payload = {
    ...restOfUser,
    avatarUrl: avatarFile?.url,
  };
  logger.info("User Updated Successfully!");
  return payload;
};
export const getSignedInUserHandler = async (userId: string) => {
  logger.info("Getting Signed In User", { userId });
  // Find user in DB
  const foundUser = await db.user.findUnique({
    where: { userId },

    select: { ...baseUserSelect, avatarFile: true },
  });
  if (!foundUser) {
    logger.error("Could not find signed in user.", { userId });
    throw new HttpError({
      status: "FORBIDDEN",
      message: "User not found",
    });
  }
  const { avatarFile, ...restOfUser } = foundUser;
  const payload = {
    ...restOfUser,
    avatarUrl: avatarFile?.url,
  };
  logger.info("Signed In User Retrieved Successfully!");
  return payload;
};
export const getUserByIdHandler = async (userId: string) => {
  logger.info("Getting User By Id", { userId });
  // Find the user
  const foundUser = await db.user.findUnique({
    where: { userId },
    select: { ...baseUserSelect, avatarFile: true },
  });
  if (!foundUser) {
    logger.error("User Not Found By Id: ", { userId });
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
  logger.info("User Found By Id Successfully.");
  return payload;
};
export const getSignedInUserFriendsHandler = async (signedInUserId: string) => {
  logger.info("Started Getting Signed In Friends");
  const friends = await db.friend.findMany({
    where: {
      OR: [{ senderId: signedInUserId }, { receiverId: signedInUserId }],
    },
    include: {
      sender: { include: { avatarFile: true } },
      receiver: { include: { avatarFile: true } },
    },
  });

  const updatedFriends = friends.map((friend) => {
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
  logger.info("Found Signed In User's Friends Successfully.");
  return updatedFriends;
};

export const updateSignedInUserAvatarHandler = async (
  userId: string,
  file: S3StorageFile
) => {
  logger.info("Starting User Avatar Update");

  const { metadata, key, location, size, acl, bucket } = file;

  const foundUser = await db.user.findUnique({
    where: { userId },
    select: { ...baseUserSelect, avatarFile: true },
  });

  if (!foundUser) {
    logger.info("User ");
  }

  if (foundUser && foundUser.avatarFile) {
    logger.info("Deleting Old File");
    await deleteObject(foundUser.avatarFile.key);
  }

  logger.info("User Avatar Updated");
  const payload = {
    url: location,
    size,
    bucket,
    key,
    originalName: metadata.originalName,
  };
  const updatedUser = await db.user.update({
    where: { userId },
    data: {
      avatarFile: {
        upsert: {
          create: payload,
          update: payload,
        },
      },
    },
    select: { ...baseUserSelect, avatarFile: true },
  });
  const { avatarFile, ...restOfUser } = updatedUser;
  const returnPayload = {
    ...restOfUser,
    avatarUrl: avatarFile?.url,
  };
  logger.info("User Updated Successfully!");
  return returnPayload;
};

export const deleteSignedInUserAvatarHandler = async (userId: string) => {
  logger.info("Deleting Signed In Avatar");

  const foundUser = await db.user.findUnique({
    where: { userId },
    select: { ...baseUserSelect, avatarFile: true },
  });

  if (!foundUser) {
    logger.error("User Not Found By Id", { userId });
    throw new HttpError({ status: "NOT_FOUND", message: "User not found" });
  }

  const { avatarFile, ...restOfUser } = foundUser;

  if (avatarFile) {
    logger.info("Deleting Old File");
    await deleteObject(avatarFile.key);
    await db.user.update({
      where: { userId },
      data: { avatarFile: { delete: true } },
      select: { ...baseUserSelect, avatarFile: false },
    });
  }

  const updatedUser = {
    ...restOfUser,
    avatarUrl: avatarFile?.url,
  };

  logger.info("User Avatar Deleted!");
  return updatedUser;
};
