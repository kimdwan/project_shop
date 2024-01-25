import { Injectable } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

@Injectable()
export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email : string 

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  password : string
}