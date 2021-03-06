import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Project } from "../models/project";
import { auth0 } from "../models/users";

const router = Router();

router.get("/api/project", [], async (req: Request, res: Response) => {
  try {
    let query = {};
    if (req.query?.search) {
      query = { title: new RegExp(req.query.search as string, 'i') };
    }
    const project = await Project.find(query);
    return res.status(StatusCodes.OK).send(project);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

router.get("/api/project/:id", [], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    return res.status(StatusCodes.OK).send(project);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

router.put("/api/project/:id", async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(StatusCodes.OK).send(project);
    } catch(e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
});

router.post("/api/project", async (req: Request, res: Response) => {
  try {
    const { title, description, tasks, users, rooms } = req.body;
    const project = Project.build({ title, description, tasks, users, rooms });
    await project.save();
    return res.status(StatusCodes.CREATED).send(project);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

router.delete("/api/project/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  return res.status(StatusCodes.OK).send();
});

router.get("/api/project/:id/assigned", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    const users = await auth0.getUsers({
      q: `user_id:(${project.users.join(' OR ')})`
    });

    return res.status(StatusCodes.OK).send(users);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

export { router as projectRouter };