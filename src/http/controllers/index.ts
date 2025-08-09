import { Request, Response } from "express";
import { SignupDto } from "@dtos/signup.dto";
import * as DB from "@models/index";
import { StatusCodes } from "http-status-codes";
import { LoginDto } from "@dtos/login.dto";
import { JWT } from "@utils/jwt";
import { UserRequest } from "@middleware/auth.middleware";
import { UpdateprofileDto } from "@dtos/update-profile.dto";
import { OnePipeLive, OnePipeInterface, OnePipeMockUp } from "@utils/onepipe";
import { CreateWalletDto, Gender } from "@dtos/createwallet.dto";
import { OtpDto } from "@dtos/validate-otp.dto";

class AuthController {
  // use this when you have a live token and secret
  // private onePipe: OnePipeInterface = new OnePipeLive();
  private onePipe: OnePipeInterface = new OnePipeMockUp();

  async signUp(req: Request, res: Response) {
    const payload: SignupDto = req.body;

    const existingUser = await DB.User.findOne({ email: payload.email });

    if (existingUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    const passwordHash: string = await DB.User.hashPassword(payload.password);

    const newUser = new DB.User({
      // first_name: payload.first_name,
      // last_name: payload.last_name,
      name: payload.name,
      phone_number: payload.phone_number,
      email: payload.email,
      password: passwordHash,
    });

    await newUser.save();

    return res.status(201).json({ message: "success" });
  }

  async login(req: Request, res: Response) {
    const payload: LoginDto = req.body;

    const filteredPayload: Record<string, string> = {};
    if (payload.email) {
      filteredPayload["email"] = payload.email;
    } else {
      filteredPayload["phone_number"] = payload.phone_number;
    }

    const user = await DB.User.findOne(filteredPayload);
    if (user == null) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await DB.User.comparePassword(
      payload.password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const jwtToken = new JWT().createEncryptedToken({
      id: user._id.toString(),
    });

    return res
      .status(StatusCodes.OK)
      .json({ message: "success", data: { jwtToken } });
  }

  async profile(req: Request, res: Response) {
    const user = await DB.User.findById((req as UserRequest).userId).select(
      "phone_number email first_name last_name"
    );
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", data: user?.toJSON() });
  }

  async updateProfile(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;
    const payload: UpdateprofileDto = req.body;

    const user = await DB.User.findById(userId).select(
      "phone_number email first_name last_name"
    );
    if (user == null) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }
    const keys = Object.keys(payload);
    for (const key of keys) {
      // @ts-ignore
      user[key] = payload[key];
    }
    if (keys.length > 0) {
      await user.save();
    }
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      avatar: user.avatar,
    };
    return res
      .status(StatusCodes.OK)
      .json({ message: "success", data: userData });
  }

  async createWallet(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;
    const payload: CreateWalletDto = req.body;
    const user = await DB.User.findById(userId);
    const existingWallet = await DB.Wallet.findOne({
      user: DB.ObjectId(userId),
    });
    if (user == null) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    if (existingWallet != null) {
      const msg = existingWallet.activated
        ? "wallet found, validate otp to continue"
        : "wallet creation completed";
      return res.status(StatusCodes.OK).json({ message: msg });
    }

    user.address = payload.address;
    user.city = payload.city;
    user.gender = payload.gender == Gender.MALE ? "M" : "F";
    user.state = payload.state;
    user.title = payload.users_title;
    await user.save();

    const transaction_ref = this.onePipe.generateRequestRef();
    const wallet = new DB.Wallet({
      user: user._id,
      wallet_req_ref: transaction_ref,
      token: {
        one: this.onePipe.generateRequestRef(),
        two: this.onePipe.generateRequestRef(),
      },
    });
    await wallet.save();

    const [surname, firstname, ..._] = user.name.split(" ");

    const pipe = await this.onePipe.createWallet({
      user_id: userId,
      transaction_ref: transaction_ref,
      firstname: firstname,
      surname: surname,
      email: user.email,
      mobile_no: user.phone_number.replace("+", ""),
      date_of_birth: new Date(), //
      gender: user.gender as "M" | "F", //
      title: user.title as "Dr" | "Miss" | "Mr" | "Mrs",
      address: user.address,
      city: user.city,
      state: user.state,
      token1: wallet.token.one,
      token2: wallet.token.two,
    });
    return res.status(StatusCodes.OK).json({ message: "success", data: pipe });
  }

  async verifyOtp(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;
    const payload: OtpDto = req.body;

    const user = await DB.User.findById(userId);
    const wallet = await DB.Wallet.findOne({ user: DB.ObjectId(userId) });
    if (user == null || wallet == null) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid credentials" });
    }

    const verifyOtp = await this.onePipe.validateotp(
      payload.otp,
      wallet.wallet_req_ref
    );

    if (verifyOtp.status != "Success") {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: verifyOtp.message,
        data: verifyOtp.data,
      });
    }

    const statusQuery = await this.onePipe.queryAccountCreation({
      transaction_ref: wallet.wallet_req_ref,
    });

    if (statusQuery.status == "Successful") {
      wallet.activated = true;
      wallet.save();
    }
    return res.status(StatusCodes.OK).send({
      message: "success",
      data: verifyOtp.data,
    });
  }

  async walletInfo(req: Request, res: Response) {
    const userId = (req as UserRequest).userId;
    const wallet = await DB.Wallet.findOne({ user: DB.ObjectId(userId) });
    if (wallet == null) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "wallet not found" });
    }

    const pipe = await this.onePipe.getWalletInfo(userId);
    return res.status(StatusCodes.OK).send({
      message: "success",
      data: pipe.data.provider_response,
    });
  }
}

export default AuthController;
