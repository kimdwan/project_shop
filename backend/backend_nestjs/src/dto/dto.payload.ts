import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

class Sub {

  @IsEmail()
  @IsNotEmpty()
  email : string 

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  nickname : string 
}

@Injectable()
export class PayloadDto {

  @IsNotEmpty()
  @IsString()
  userId : string

  @IsNotEmpty()
  @Type(() => Sub)
  sub : Sub 
}