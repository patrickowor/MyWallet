import { SocketRequest } from "@middleware/socket.middleware";
import { Socket, Server as SocketServer } from "socket.io";
import * as DB from "@models/index";

export const SocketHandler = (io: SocketServer) => {
  return async (socket: Socket) => {
    // await DB.User.updateOne(
    //   { _id: DB.ObjectId((socket as SocketRequest).userId) },
    //   { $set: { socketId: socket.id } }
    // );

    //joining personal room to aid direct messaging
    socket.join((socket as SocketRequest).userId);

    socket.on("newMessage", async ({ phone_number, msg }) => {
      const recipient = await DB.User.findOne({
        phone_number: phone_number,
      });

      if (recipient == null) {
        return socket.emit("msg_error", "recipient doesnt exist");
      }

      const message = new DB.Message({
        sender: DB.ObjectId((socket as SocketRequest).userId),
        recipient: recipient._id,
        msg: msg,
      });
      await message.save();

      io.to(recipient._id.toString()).emit("messageRecieved", {
        msg,
        phone_number,
      });
      socket.emit("messageSent", { msg, phone_number });


    });



    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  };
};


