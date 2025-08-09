import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Match } from "./validators/match.validator";

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @Match("password", { message: "Passwords do not match" })
  confirm_password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  // @IsString()
  // @IsNotEmpty()
  // first_name!: string;

  // @IsString()
  // @IsNotEmpty()
  // last_name!: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber("NG")
  phone_number!: string;
}
