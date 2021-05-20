import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Project } from "../models/project";
import { Task } from "../models/task";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const router = Router();


//update task
router.put(
  "/api/project/:projectId/task/:id",
  async (req: Request, res: Response) => {
    try {
      const { id, projectId } = req.params;

      const task = await Project.findOneAndUpdate(
        { _id: projectId, "tasks._id": id },
        { $set: { "tasks.$": req.body } },
        { new: true }
      );
      return res.status(StatusCodes.OK).send(task);
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
  }
);


//create task
router.post(
  "/api/project/:projectId/task",
  async (req: Request, res: Response) => {
    try {
      const { projectId } = req.params;

      const task = Task.build({ ...req.body });
      const project = await Project.findById(projectId);

      project.tasks.push(task);

      await project.save();
      return res.status(StatusCodes.CREATED).send(project);
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
  }
);

//update task status 
router.put(
  "/api/project/:projectId/task/:id/status",
  async (req: Request, res: Response) => {
    try {
      const { id, projectId } = req.params;

      const task = await Project.findOneAndUpdate(
        { _id: projectId, "tasks._id": id },
        { $set: { "tasks.$.status": req.body.status } },
        { new: true }
      );
      return res.status(StatusCodes.OK).send(task);
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
  }
);


//delete task
router.put("/api/project/:projectId/task/:id/delete", async (req: Request, res: Response) => {
  const { id, projectId } = req.params;
  const project = await Project.findOneAndUpdate({_id: projectId}, {"$pull": { "tasks": { _id: id } } }, { new: true })
  return res.status(StatusCodes.OK).send(project);
});


//get tasks by project
router.get("/api/project/:projectId/task", [], async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const query = {};
  if (req.query?.search) {
    query['tasks.title'] = new RegExp(req.query.search as string, 'i');
  }
  const task = await Project.aggregate([
    { $match: { _id: ObjectId(projectId) } },
    { $unwind: "$tasks" },
    { $match: query },
    { $project: { _id: 0, tasks: 1 }},
    { $group: { _id: projectId, tasks: {$addToSet: "$tasks" }}},
])
  return res.status(StatusCodes.OK).send(task[0]);
});


//get tasks in all projects
router.get("/api/project/task", [], async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const task = await Project.find({},{ tasks: 1 });
  return res.status(StatusCodes.OK).send(task);
});

export { router as taskRouter };
