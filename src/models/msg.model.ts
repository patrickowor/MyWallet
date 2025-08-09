import { text } from "express";
import mongoose from "mongoose";

interface IMsg {
  user: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  msg: string;
}

const msgSchema = new mongoose.Schema<IMsg>(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    msg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model<IMsg>("Message", msgSchema);