import { Router } from "express";
import userRouter from "./auth.router";
import msgRouter from './msg.router';

export function setRoutes(app: Router) {
  app.use("/api/", userRouter);
  app.use("/api/", msgRouter);
}