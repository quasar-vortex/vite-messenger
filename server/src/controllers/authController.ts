import { NextFunction, Request, Response, RequestHandler } from "express";
import { LoginUserModel, RegisterUserModel } from "../models/authModels";
import * as authService from "../services/authService";
import { appConfig } from "../config/env";
import HttpError from "../config/httpError";
import { asyncHandler } from "../middleware/asyncHandler"; // Import the asyncHandler utility

export const registerUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userInfo = req.body as RegisterUserModel;

    const { tokens, user } = await authService.registerUser(userInfo);

    // Set HTTP refresh token
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 60 * 60 * 24 * 1000 * 7 - 60 * 60 * 1000, // 7 days minus 1 hour
      secure: appConfig.node_env === "production",
      httpOnly: true,
    });

    res.status(201).json({ user, accessToken: tokens.accessToken });
  }
);

export const loginUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userInfo = req.body as LoginUserModel;

    const { tokens, user } = await authService.loginUser(userInfo);

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 60 * 60 * 24 * 1000 * 7 - 60 * 60 * 1000,
      secure: appConfig.node_env === "production",
      httpOnly: true,
    });

    res.status(201).json({ user, accessToken: tokens.accessToken });
  }
);

export const refreshUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    // Extract refresh token from cookies
    const token = req.cookies?.refreshToken as string;

    // If no refresh token is present, throw an error
    if (!token) {
      throw new HttpError({
        status: "NOT_AUTHORIZED",
        message: "Refresh Token Required.",
      });
    }

    const {
      tokens: { accessToken },
      user,
    } = await authService.refreshUser(token);

    res.status(200).json({ user, accessToken });
  }
);

export const logOffUserHandler = asyncHandler(
  async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.user!.id;

    await authService.logOffUser(userId);

    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Signed Out!" });
  }
);
