import moongose from "mongoose";

export interface IRoom {
  title: string;
}

interface IRoomDocument extends moongose.Document {
  title: string;
}

interface IRoomModel extends moongose.Model<IRoomDocument> {
  build(attr: IRoom): IRoomDocument;
}

export const roomScheme = new moongose.Schema({
  title: {
    type: String,
    required: true,
  }
});

roomScheme.statics.build = (attr: IRoom) => {
  return new Room(attr);
};

const Room = moongose.model<any, IRoomModel>("Room", roomScheme);

export { Room };