import moongose from "mongoose";
import { roomScheme } from "./room";

enum TASK_STATUS {
    BACKLOG = "backlog", 
    TODO = "todo", 
    REVIEW = "review", 
    DONE = "done"
}
interface IComment {
  authorId: string;
  text: string;
  createdAt: number;
}

export const commentScheme = new moongose.Schema({
  authorId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  }
});

export interface ITask {
  _id?: string;
  slug: string;
  title: string;
  description?: string;
  status?: TASK_STATUS;
  order: number;
  comments: IComment[];
}

interface ITaskDocument extends moongose.Document {
  _id?: string;
  slug: string
  title: string;
  description?: string;
  status?: TASK_STATUS;
  order: number;
  comments: IComment[];
}

interface ITaskModel extends moongose.Model<ITaskDocument> {
    build(attr: ITask): ITaskDocument;
}

export const taskScheme = new moongose.Schema({
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    required: false,
  },
  createdBy: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  order: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.BACKLOG
  },
  comments: [commentScheme]
});

taskScheme.statics.build = (attr: ITask) => {
    return new Task(attr);
}

const Task = moongose.model<any, ITaskModel>("Task", taskScheme);

export { Task }
