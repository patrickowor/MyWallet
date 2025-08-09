import { IsNotEmpty, IsNumberString } from "class-validator";

export class OtpDto {
    @IsNumberString()
    @IsNotEmpty()
    otp!: string;
}