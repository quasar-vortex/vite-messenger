import { RequestHandler } from "express";
import z from "zod";

type ValFunction = (s: z.ZodSchema) => RequestHandler;
export const valMiddleware: ValFunction = (s) => async (req, res, next) => {
  try {
    await s.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ issues: error.issues, message: "Check your input." });
      return;
    }
    next(error);
  }
};
