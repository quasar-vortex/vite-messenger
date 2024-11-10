import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { valMiddleware } from "../middleware/valMiddleware";
import { updateUserSchema } from "../models/userModels";

const userRouter = Router();

userRouter
  .patch("/me", authMiddleware, valMiddleware(updateUserSchema))
  .get("/me")
  .get("/:userId")
  .get("/me/friends")
  .put("/me/avatar")
  .delete("/me/avatar");
