import { Server } from "socket.io";
import { Socket } from "socket.io";

export const setupSocket = (server: any) => {
    const io = new Server(server);

    io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });

        // Custom event example
        socket.on("sendMessage", (message: string) => {
            console.log("Message received:", message);
            io.emit("newMessage", message);
        });
    });

    return io;
};