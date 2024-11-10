import { db } from "../config/db";
import HttpError from "../config/httpError";
import logger from "../config/logger";
import { LoginUserModel, RegisterUserModel } from "../models/authModels";
import { baseUserSelect } from "../models/userModels";
import {
  hashPassword,
  signUserToken,
  verifyHashedPassword,
  verifyUserToken,
} from "../utils/authUtils";

export const registerUser = async (data: RegisterUserModel) => {
  logger.info("Register User Started");
  // Check if the user exists
  const foundUser = await db.user.findFirst({
    where: { OR: [{ email: data.email }, { userName: data.userName }] },
  });

  // If user exists throw error
  if (foundUser) {
    logger.error("Register User Failed, Email or Username in use.");
    throw new HttpError({
      status: "BAD_REQUEST",
      message: "Email or Username Exists",
    });
  }

  // Create user
  const passwordHash = await hashPassword(data.password);
  const newUser = await db.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
      userName: data.userName,
    },
    select: { ...baseUserSelect, avatarFile: true },
  });

  // Sign User Tokens
  const tokens = {
    refreshToken: signUserToken({
      type: "ACCESS_TOKEN",
      payload: { id: newUser.userId },
    }),
    accessToken: signUserToken({
      type: "REFRESH_TOKEN",
      payload: { id: newUser.userId },
    }),
  };

  // update token in db
  await db.user.update({
    where: { userId: newUser.userId },
    data: { refreshToken: tokens.refreshToken },
  });

  const payload = { user: newUser, tokens };

  logger.error("Register User Succeeded", { userId: newUser.userId });
  return payload;
};

export const loginUser = async (data: LoginUserModel) => {
  logger.info("Login User Started");
  const foundUser = await db.user.findUnique({
    where: { email: data.email },
    select: { ...baseUserSelect, avatarFile: true, passwordHash: true },
  });

  if (!foundUser) {
    logger.error("Unable to sign in user, account not found.", {
      email: data.email,
    });
    throw new HttpError({
      status: "NOT_FOUND",
      message: "User not found",
    });
  }
  const { passwordHash, ...restOfFoundUser } = foundUser;
  // Verify the provided password
  const isPasswordValid = await verifyHashedPassword(
    passwordHash,
    data.password
  );

  if (!isPasswordValid) {
    logger.error("Unable to sign in user, credentials invalid.", {
      userId: foundUser.userId,
    });
    throw new HttpError({
      status: "NOT_AUTHORIZED",
      message: "Invalid credentials",
    });
  }

  // Create access and refresh tokens
  const accessToken = signUserToken({
    type: "ACCESS_TOKEN",
    payload: { id: foundUser.userId },
  });

  const refreshToken = signUserToken({
    type: "REFRESH_TOKEN",
    payload: { id: foundUser.userId },
  });

  // Update the refresh token in the database
  await db.user.update({
    where: { userId: foundUser.userId },
    data: { refreshToken },
  });
  logger.info("Login User Completed");
  return { user: restOfFoundUser, tokens: { accessToken, refreshToken } };
};

export const refreshUser = async (refreshToken: string) => {
  logger.info("Refresh User Started");
  // Verify the refresh token using your auth utils
  const decodedPayload = await verifyUserToken({
    payload: refreshToken,
    type: "REFRESH_TOKEN",
  });

  // Fetch user from database based on userId in payload
  const foundUser = await db.user.findUnique({
    where: { userId: decodedPayload.id },
    select: { ...baseUserSelect, avatarFile: true },
  });

  if (!foundUser) {
    logger.info("Refresh User Failed, User Not Found.", {
      userId: decodedPayload.id,
    });
    throw new HttpError({
      status: "NOT_FOUND",
      message: "User not found",
    });
  }

  // Create a new access token
  const accessToken = signUserToken({
    type: "ACCESS_TOKEN",
    payload: { id: decodedPayload.id },
  });

  logger.info("User Refreshed Successfully");
  return { user: foundUser, tokens: { accessToken } };
};

export const logOffUser = async (refreshToken: string) => {
  logger.info("Log Off User Started");
  // Verify the refresh token using your auth utils
  const decodedPayload = await verifyUserToken({
    payload: refreshToken,
    type: "REFRESH_TOKEN",
  });

  // Fetch user from database based on userId in payload
  const foundUser = await db.user.findUnique({
    where: { userId: decodedPayload.id },
    select: { ...baseUserSelect, avatarFile: true },
  });

  if (!foundUser) {
    logger.info("Log Off User Failed, User Not Found", {
      userId: decodedPayload.id,
    });
    throw new HttpError({
      status: "NOT_FOUND",
      message: "User not found",
    });
  }
  // Delete the refresh token from the database for the user
  await db.user.update({
    where: { userId: foundUser.userId },
    data: { refreshToken: null },
  });
  logger.info("User Signed Out");
  return { message: "User Signed Out" };
};
