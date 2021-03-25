import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Task } from "../models/task";

const router = Router();

router.get("/api/task", [], async (_req: Request, res: Response) => {
  const task = await Task.find({});
  return res.status(StatusCodes.OK).send(task);
});

router.put("/api/task/:id", async(req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(StatusCodes.OK).send(task);
    } catch(e) {
        return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
});

router.post("/api/task", async (req: Request, res: Response) => {
  try {
    const { title, status } = req.body;
    const task = Task.build({ title, status });
    await task.save();
    return res.status(StatusCodes.CREATED).send(task);
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).send(e);
  }
});

router.put("/api/task/:id/status", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    return res.status(StatusCodes.OK).send(task);
});

router.delete("/api/task/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  return res.status(StatusCodes.OK).send();
});

export { router as taskRouter };
