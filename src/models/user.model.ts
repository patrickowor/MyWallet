import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  phone_number: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  gender?: string;
  city?: string;
  address?: string;
  title?: string;
  state?: string;
  socketId?: string;
}

interface UserModelType extends mongoose.Model<IUser> {
  hashPassword(password: string): Promise<string>;
  comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    socketId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
}

userSchema.statics.comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
}
export const User = mongoose.model<IUser, UserModelType>("User", userSchema);
