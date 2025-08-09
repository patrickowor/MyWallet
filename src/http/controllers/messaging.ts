import { Request, Response } from "express";
import * as DB from "@models/index";
import { StatusCodes } from "http-status-codes";
import { UserRequest } from "@middleware/auth.middleware";
import { PhoneDto } from "@dtos/phone_number.dto";

export default class MsgController {
  async getChatHistory(req: Request, res: Response) {
    const { phone_number } = req.params;
    const userId = (req as UserRequest).userId;

    const recipient = await DB.User.findOne({
      phone_number: phone_number,
    });

    if (recipient == null) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: "invalid phone number provided",
      });
    }

    const id1 = recipient._id;
    const id2 = DB.ObjectId(userId);

    const messages = await DB.Message.find({
      $or: [
        { recipient: id1, sender: id2 },
        { recipient: id2, sender: id1 },
      ],
    })
      .populate("sender", "name phone_number")
      .populate("recipient", "name phone_number")
      .exec();

    return res
      .status(StatusCodes.OK)
      .json({ message: "success", data: messages });
  }

  async callHistory(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;

    const calls = await DB.CallHistory.find({
      users: { $in: [DB.ObjectId(userId)] },
    })
      .populate("users", "name phone_number")
      .sort({ createdAt: 1 })
      .exec();;

    return res
        .status(StatusCodes.OK)
        .json({ message: "success", data: calls });
  }

  async startCall(req: Request, res: Response) {
    const { phone_number } : PhoneDto = req.body;
    const userId = (req as UserRequest).userId;


    const recipient = await DB.User.findOne({
        phone_number: phone_number,
    });

    if (recipient == null) {
        return res.status(StatusCodes.BAD_REQUEST).send({
        message: "invalid phone number provided",
        });
    }

    const id = recipient._id.toString();

    const existingCall = await DB.CallHistory.findOne({
      users: { $in: [DB.ObjectId(userId), DB.ObjectId(id)] },
      ended: false,
    });

    if (existingCall != null) {
        return res.status(StatusCodes.BAD_REQUEST).send({
            message: "users busy, try again later",
        });
    }

    const call = new DB.CallHistory({
      users: [DB.ObjectId(userId), DB.ObjectId(id)],
      ended: false
    });
    await call.save()

    return res
        .status(StatusCodes.OK)
        .json({ message: "success"});
  }

  async endCall(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;

    const existingCall = await DB.CallHistory.findOne({
      users: { $in: [DB.ObjectId(userId)] },
      ended: false,
    });

    if (existingCall != null) {
        existingCall.ended = true;
        await existingCall.save()
    }

    return res.status(StatusCodes.OK).json({ message: "success" });
  }
}
