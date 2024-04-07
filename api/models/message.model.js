import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  sendId: {
    type: String,
    require: true,
  },
  sendName: {
    type: String,
    require: true,
  },
  receiveId: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  time: {
    type: String,
    require: true,
  },
});

const Message = mongoose.models?.Message || mongoose.model("Message", messageSchema);
export default Message;