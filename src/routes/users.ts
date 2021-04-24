import axios from "axios";
import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/api/user", [], async (_req: Request, res: Response) => {

  try {
    const {data: {access_token}} = await axios.post(
      "https://dev-7-1p73ta.eu.auth0.com/oauth/token",
      {
        client_id: "sSXznTp3RoYjCyp1C3kuq6mCR8gT5LXP",
        client_secret:
          "Xzb-Iu_YyMjn-MrpmUDGGOaYkUwOTJEpseHlRJWR4Wxo2y3uBoMjg5y-X_f6OO3W",
        audience: "https://dev-7-1p73ta.eu.auth0.com/api/v2/",
        grant_type: "client_credentials",
      }
    );
  
    const { data: users } = await axios.get("https://dev-7-1p73ta.eu.auth0.com/api/v2/users", {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    });

    return res.status(StatusCodes.OK).send(users);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

export { router as userRouter };
