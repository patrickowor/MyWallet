import express from 'express';
import mongoose from 'mongoose';
import { Env, connectToDatabase } from '@config/index';
import { setRoutes } from '@routes/index';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import { errorHandler } from '@middleware/error.middleware';
import { SocketHandler } from '@controllers/socket';
import { socketAuthMiddleware } from '@middleware/socket.middleware';
import morgan from "morgan";


const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {cors: { origin: "*" }},);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan((tokens: any, req: any, res: any) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number(tokens["response-time"](req, res)),
      remote_addr: tokens["remote-addr"](req, res),
      user_agent: tokens["user-agent"](req, res),
      date: tokens.date(req, res, "iso"),
    });
  })
);

setRoutes(app);
io.use(socketAuthMiddleware)
io.on("connection", SocketHandler(io));

app.use((req, res, next) => {
  const err = new Error("Route not found");
  (err as any).status = 404;
  next(err);
});

app.use(errorHandler);

connectToDatabase()
  .then(() => {
    server.listen(Env.PORT, () => {
      console.log(`Server is running on http://localhost:${Env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });