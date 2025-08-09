import { IsEmail, IsEnum, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { Match } from "./validators/match.validator";

export enum Gender{
  MALE = 'male',
  FEMALE = 'female'
} 

export enum Title {
  DR = 'Dr',
  MR = 'Mr',
  MISS = 'Miss',
  MRS = 'Mrs'
}

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Title)
  users_title!: Title;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;
}
