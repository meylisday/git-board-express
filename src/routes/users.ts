import axios from "axios";
import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { auth0 } from "../models/users";

const router = Router();

router.get("/api/user", [], async (_req: Request, res: Response) => {
  try {
    const users = await auth0.getUsers();

    return res.status(StatusCodes.OK).send(users);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

export { router as userRouter };
