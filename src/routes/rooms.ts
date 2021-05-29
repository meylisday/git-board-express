import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Room } from "../models/room";
import mongoose from "mongoose";
import { Project } from "../models/project";
const ObjectId = mongoose.Types.ObjectId;

const router = Router();

//create room
router.post(
    "/api/project/:projectId/room",
    async (req: Request, res: Response) => {
      try {
        const { projectId } = req.params;
  
        const room = Room.build({ ...req.body });
        const project = await Project.findById(projectId);
  
        project.rooms.push(room);
  
        await project.save();
        return res.status(StatusCodes.CREATED).send(project);
      } catch (e) {
        return res.status(StatusCodes.BAD_REQUEST).send(e);
      }
    }
  );

//delete room
router.put("/api/project/:projectId/room/:id/delete", async (req: Request, res: Response) => {
    const { id, projectId } = req.params;
    const project = await Project.findOneAndUpdate({_id: projectId}, {"$pull": { "rooms": { _id: id } } }, { new: true })
    return res.status(StatusCodes.OK).send(project);
  });
  

//get rooms by project
router.get("/api/project/:projectId/room", [], async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const query = {};
    if (req.query?.search) {
      query['rooms.title'] = new RegExp(req.query.search as string, 'i');
    }
    const room = await Project.aggregate([
      { $match: { _id: ObjectId(projectId) } },
      { $unwind: "$rooms" },
      { $match: query },
      { $project: { _id: 0, rooms: 1 }},
      { $group: { _id: projectId, rooms: {$addToSet: "$rooms" }}},
  ])
    return res.status(StatusCodes.OK).send(room[0]);
  });

export { router as roomRouter };