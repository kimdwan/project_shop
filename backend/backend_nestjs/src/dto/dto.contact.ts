import { Injectable } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

@Injectable()
export class ContactDto {

  @IsOptional()
  @IsString()
  @MaxLength(20)
  first_name : string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  last_name : string

  @IsNotEmpty()
  @IsEmail()
  email : string

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  messages : string

}