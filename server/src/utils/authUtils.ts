// src/utils/authUtils.ts

import argon from "argon2";
import jwt from "jsonwebtoken";
import { accessConfig, refreshConfig } from "../config/env";
import HttpError from "../config/httpError";

export const hashPassword = async (text: string) => await argon.hash(text);

export const verifyHashedPassword = async (hash: string, plain: string) =>
  await argon.verify(hash, plain);

type TokenType = "ACCESS_TOKEN" | "REFRESH_TOKEN";

type SignUserTokenPayload = {
  id: string;
};

type SignTokenRequest = {
  type: TokenType;
  payload: SignUserTokenPayload;
};

type VerifyTokenRequest = {
  type: TokenType;
  payload: string;
};

export const signUserToken = ({ type, payload }: SignTokenRequest) => {
  const { expiresIn, secret } =
    type == "ACCESS_TOKEN" ? accessConfig : refreshConfig;
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyUserToken = ({
  type,
  payload,
}: VerifyTokenRequest): Promise<SignUserTokenPayload> => {
  const secret = (type == "ACCESS_TOKEN" ? accessConfig : refreshConfig).secret;
  return new Promise((res, rej) => {
    jwt.verify(payload, secret, (err, jwtPayload) => {
      if (err)
        rej(
          new HttpError({ status: "NOT_AUTHORIZED", message: "Invalid Token" })
        );
      res(jwtPayload as SignUserTokenPayload);
    });
  });
};
