import { Router } from "express";
import AuthController from "@controllers/index";
import { validateDto } from "@middleware/validator.middleware";
import { SignupDto } from "@dtos/signup.dto";
import { LoginDto } from "@dtos/login.dto";
import { authMiddleware } from "@middleware/auth.middleware";
import { UpdateprofileDto } from "@dtos/update-profile.dto";
import { OtpDto } from "@dtos/validate-otp.dto";
import { CreateWalletDto } from "@dtos/createwallet.dto";

const router = Router();
const authController = new AuthController();

router.post(
  "/login",
  validateDto(LoginDto),
  authController.login.bind(authController)
);
router.post(
  "/signup",
  validateDto(SignupDto),
  authController.signUp.bind(authController)
);

router
  .route("/profile")
  .all(authMiddleware)
  .get(authController.profile.bind(authController))
  .put(
    validateDto(UpdateprofileDto),
    authController.updateProfile.bind(authController)
  );


router.post(
  "/wallet/create",
  authMiddleware,
  validateDto(CreateWalletDto),
  authController.createWallet.bind(authController)
);
router.patch(
  "/wallet/create",
  authMiddleware,
  validateDto(OtpDto),
  authController.createWallet.bind(authController)
);
router.get(
  "/wallet/balance",
  authMiddleware,
  authController.walletInfo.bind(authController)
);


export default router;
