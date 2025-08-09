import { Request, Response, NextFunction } from "express";
import { JWT } from "@utils/jwt";

export interface UserRequest extends Request {
    userId: string
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
 const jwt = new JWT();
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1].trim();
  const decoded = jwt.decryptAndVerifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  (req as UserRequest).userId = decoded.id;
  next();
}
