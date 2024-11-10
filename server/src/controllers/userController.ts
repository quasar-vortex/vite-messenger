import HttpError from "../config/httpError";
import { asyncHandler } from "../middleware/asyncHandler";
import { UpdateUserSchema } from "../models/userModels";
import * as userService from "../services/userService";
import { S3StorageFile } from "../utils/uploadUtils";
export const updateUserHandler = asyncHandler(async (req, res, next) => {
  const data = req.body as UpdateUserSchema;
  //@ts-ignore
  const userId = req.user.id;
  const updatedUser = await userService.updateUserHandler(userId, data);
  return res.status(200).json(updatedUser);
});
export const getSignedInUserHandler = asyncHandler(async (req, res, next) => {
  // @ts-ignore
  const userId = req.user.id;
  const user = await userService.getSignedInUserHandler(userId);
  return res.status(200).json(user);
});
export const getUserByIdHandler = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await userService.getUserByIdHandler(userId);
  return res.status(200).json(user);
});
export const getSignedInUserFriendsListHandler = asyncHandler(
  async (req, res, next) => {
    // @ts-ignore
    const userId = req.user.id;
    const friendsList = await userService.getSignedInUserFriendsHandler(userId);
    return res.status(200).json(friendsList);
  }
);
export const updateSignedInUserAvatarFileHandler = asyncHandler(
  async (req, res, next) => {
    //@ts-ignore
    const userId = req.user.id;
    const file = req?.file as unknown as S3StorageFile;
    if (!file)
      throw new HttpError({
        status: "BAD_REQUEST",
        message: "No file provided",
      });
    const updatedAvatar = await userService.updateSignedInUserAvatarHandler(
      userId,
      file
    );
    return res.status(200).json(updatedAvatar);
  }
);
export const deleteSignedInAvatarFileHandler = asyncHandler(
  async (req, res, next) => {
    //@ts-ignore
    const userId = req.user.id;
    const updatedUser = await userService.deleteSignedInUserAvatarHandler(
      userId
    );
    return res.status(200).json(updatedUser);
  }
);
