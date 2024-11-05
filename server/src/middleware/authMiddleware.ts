import { RequestHandler } from "express";
import HttpError from "../config/httpError";
import * as authUtils from "../utils/authUtils";

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const headers = (req.headers?.authorization ||
      req.headers?.Authorization) as string | undefined;

    const token = headers
      ? headers.split("Bearer ")[1]
      : req.cookies?.accessToken;
    if (!token)
      throw new HttpError({
        status: "NOT_AUTHORIZED",
        message:
          "No Token Provided. Must provide accessToken over httponly cookie or Bearer token in auth headers.",
      });
    const { id } = await authUtils.verifyUserToken({
      type: "ACCESS_TOKEN",
      payload: token,
    });
    //@ts-ignore
    req.user = { id };
    next();
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(401).json({ message: error.message });
      return;
    }
    next(error);
  }
};
