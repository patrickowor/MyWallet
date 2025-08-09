import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, ValidateIf } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsOptional()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @ValidateIf((obj) => obj.email === "value")
  @IsPhoneNumber("NG")
  phone_number!: string;
}
