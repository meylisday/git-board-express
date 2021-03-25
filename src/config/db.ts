const mongoose = require('mongoose');

export const moongose = mongoose.connect(
  "mongodb://localhost:27017/git-board",
  { useNewUrlParser: true },
  (err: string) => {
    if (!err) {
      console.log("Successfully Established Connection with MongoDB");
    } else {
      console.log(
        "Failed to Establish Connection with MongoDB with Error: " + err
      );
    }
  }
);
