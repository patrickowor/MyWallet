import { text } from "express";
import mongoose from "mongoose";

interface ICall {
  users: Array<mongoose.Types.ObjectId>;
  ended: boolean;
}

const callHistorySchema = new mongoose.Schema<ICall>(
  {
    users: [{
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true
    }],
    ended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CallHistory = mongoose.model<ICall>("CallHistory", callHistorySchema);