require("dotenv").config();

import express, { Application } from "express";
import { json } from "body-parser";
import mongoose from "mongoose";

import { taskRouter } from "./routes/tasks";
import { projectRouter } from "./routes/projects";
import { userRouter } from "./routes/users";
import { roomRouter } from "./routes/rooms";

import cors from "cors";

// Create a new express app instance
const app: Application = express();

app.use(json());
app.use(cors());

// Routes
app.use(taskRouter);
app.use(projectRouter);
app.use(userRouter);
app.use(roomRouter);

mongoose.set("useFindAndModify", false);
mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((e) => {
    console.error(e);
  });

app.listen(process.env.PORT, function () {
  console.log("App is listening on port 3000!");
});
