import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Project } from "../models/project";

const router = Router();

router.get("/api/project", [], async (_req: Request, res: Response) => {
  const task = await Project.find({});
  return res.status(StatusCodes.OK).send(task);
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
    const { title, description, tasks } = req.body;
    const project = Project.build({ title, description, tasks });
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

export { router as projectRouter };