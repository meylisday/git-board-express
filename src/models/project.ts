import moongose from "mongoose";
import { ITask, taskScheme } from "./task";

interface IProject {
  title: string;
  description?: string;
  tasks: ITask[];
  users: string[]
}

interface IProjectDocument extends moongose.Document {
  title: string;
  description?: string;
  tasks: ITask[];
  users: string[];
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
  }]
});

projectScheme.statics.build = (attr: IProject) => {
  return new Project(attr);
};

const Project = moongose.model<any, IProjectModel>("Project", projectScheme);

export { Project };
