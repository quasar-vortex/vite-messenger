// src/routes/authRoutes.ts

import { Router } from "express";
import { valMiddleware } from "../middleware/valMiddleware";
import { loginUserModel, registerUserModel } from "../models/authModels";
import * as authController from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

/*
  Authentication Routes:
  
  - POST /api/v1/auth/register : Register a new user (Public)
  - POST /api/v1/auth/login : Login an existing user (Public)
  - GET /api/v1/auth/refresh : Refresh access token using refresh token (Public)
  - GET /api/v1/auth/logoff : Log off the user by clearing refresh token (Protected)
*/

export const authRouter = Router();

authRouter
  .post(
    "/register",
    valMiddleware(registerUserModel),
    authController.registerUserHandler
  )
  .post(
    "/login",
    valMiddleware(loginUserModel),
    authController.loginUserHandler
  )
  // This route checkes for cookie itself, authmiddleware gets bearer tokens from headers
  .get("/refresh", authController.refreshUserHandler)
  .get("/logoff", authMiddleware, authController.logOffUserHandler);
