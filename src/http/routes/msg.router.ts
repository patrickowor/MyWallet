import { Router } from "express";
import MsgController from "@controllers/messaging";
import { authMiddleware } from "@middleware/auth.middleware";

const router = Router();
const msgController = new MsgController();


router.get(
  "/chat/history/:phone_number/",
  authMiddleware,
  msgController.getChatHistory.bind(msgController)
);

router.get(
  "/call/history",
  authMiddleware,
  msgController.callHistory.bind(msgController)
);

router.post(
  "/call/start",
  authMiddleware,
  msgController.startCall.bind(msgController)
);
router.post(
  "/call/end",
  authMiddleware,
  msgController.endCall.bind(msgController)
);

export default router;