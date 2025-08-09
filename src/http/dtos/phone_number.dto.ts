import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class PhoneDto {
    @IsPhoneNumber("NG")
    @IsNotEmpty()
    phone_number!: string;
}