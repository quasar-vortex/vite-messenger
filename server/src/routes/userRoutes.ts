import { Router } from "express";

const userRouter = Router();

userRouter
  .patch("/me")
  .get("/me")
  .get("/:userId")
  .get("/me/friends")
  .put("/me/avatar")
  .delete("/me/avatar");
