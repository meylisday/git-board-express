import express, { Application } from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import { taskRouter } from "./routes/tasks";
import { projectRouter } from "./routes/projects";
import { userRouter } from "./routes/users";

import cors from "cors";

// Create a new express app instance
const app: Application = express();

app.use(json());

app.use(cors());

// Routes
app.use(taskRouter);
app.use(projectRouter);
app.use(userRouter);

mongoose.set('useFindAndModify', false);
mongoose.connect(
  "mongodb://localhost:27017/git-board",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
  }
);

app.listen(3000, function () {
  console.log("App is listening on port 3000!");
});
