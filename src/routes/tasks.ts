import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Project, IProjectModel } from "../models/project";
import { Task, ITask } from "../models/task";
import groupBy from "lodash/groupBy";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const router = Router();

const generateSlug = (title: string, count: number) => {
  return `${title
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")}-${count + 1}`;
};

const sortTasksByOrder = async (Model: IProjectModel, projectId: string, id: string, order: number = 0) => {
  const tasks = (await Model.findOne({ _id: projectId })).tasks;

  const orderedTasks = Object.values(groupBy(tasks, 'status')).flatMap((groupedTasks: ITask[]) => {
    const taskIndex = groupedTasks.findIndex((document) => document._id.toString() === id);

    if (taskIndex >= 0) {
      groupedTasks.splice(order, 0, groupedTasks.splice(taskIndex, 1)[0])
    }

    return groupedTasks.map((task, i) => Object.assign(task, { order: i }))
  })

  return await Project.findOneAndUpdate(
    { _id: projectId },
    {
      $set: {
        tasks: orderedTasks,
      }
    },
    { new: true }
  );
}

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

      const updatedTasks = await sortTasksByOrder(Project, projectId, id);

      return res.status(StatusCodes.OK).send(updatedTasks);
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

      const project = await Project.findById(projectId);
      const task = Task.build({
        slug: generateSlug(project.title, project.tasks.length),
        order: 0,
        ...req.body,
      });

      project.tasks.push(task);

      await project.save();

      const updatedTasks = await sortTasksByOrder(Project, projectId, task._id);

      return res.status(StatusCodes.CREATED).send(project);
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
  }
);

//update task statuss
router.put(
  "/api/project/:projectId/task/:id/status",
  async (req: Request, res: Response) => {
    try {
      const { id, projectId } = req.params;

      await Project.findOneAndUpdate(
        { _id: projectId, "tasks._id": id },
        {
          $set: {
            "tasks.$.status": req.body.status,
          },
        },
        { new: true }
      );

      const updatedTasks = await sortTasksByOrder(Project, projectId, id, +req.body.order);

      return res.status(StatusCodes.OK).send(updatedTasks);
    } catch (e) {
      return res.status(StatusCodes.BAD_REQUEST).send(e);
    }
  }
);

//delete task
router.put(
  "/api/project/:projectId/task/:id/delete",
  async (req: Request, res: Response) => {
    const { id, projectId } = req.params;
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { tasks: { _id: id } } },
      { new: true }
    );
    return res.status(StatusCodes.OK).send(project);
  }
);

//get tasks by project
router.get(
  "/api/project/:projectId/task",
  [],
  async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const query = {};
    if (req.query?.search) {
      query["tasks.title"] = new RegExp(req.query.search as string, "i");
    }
    const task = await Project.aggregate([
      { $match: { _id: ObjectId(projectId) } },
      { $unwind: "$tasks" },
      { $match: query },
      { $project: { _id: 0, tasks: 1 } },
      { $group: { _id: projectId, tasks: { $addToSet: "$tasks" } } },
    ]);
    return res.status(StatusCodes.OK).send(task[0]);
  }
);

//get tasks in all projects
router.get("/api/project/task", [], async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const task = await Project.find({}, { tasks: 1 });

  return res.status(StatusCodes.OK).send(task);
});

export { router as taskRouter };
