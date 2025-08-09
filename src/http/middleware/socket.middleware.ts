import { Socket } from "socket.io";
import { JWT } from "@utils/jwt";

export interface SocketRequest extends Socket {
    userId: string
}

export function socketAuthMiddleware(socket: Socket, next : (arg?: any) => void) {
    const jwt = new JWT();
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token provided"));

      try {
        const decoded = jwt.decryptAndVerifyToken(token);
        if (!decoded){
            return next(new Error("Invalid or expired token"));
        }

        (socket as SocketRequest).userId = decoded.id; // store decoded payload for later
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }

}