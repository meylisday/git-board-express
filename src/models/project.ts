import moongose from "mongoose";
import { ITask, taskScheme } from "./task";
import { IRoom, roomScheme } from "./room";

interface IProject {
  title: string;
  description?: string;
  tasks: ITask[];
  users: string[],
  rooms: IRoom[]
}

interface IProjectDocument extends moongose.Document {
  title: string;
  description?: string;
  tasks: ITask[];
  users: string[];
  rooms: IRoom[];
}

interface IProjectModel extends moongose.Model<IProjectDocument> {
  build(attr: IProject): IProjectDocument;
}

const projectScheme = new moongose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  tasks: [taskScheme],
  users: [{
    type: String
  }],
  rooms: [roomScheme],
});

projectScheme.statics.build = (attr: IProject) => {
  return new Project(attr);
};

const Project = moongose.model<any, IProjectModel>("Project", projectScheme);

export { Project };
