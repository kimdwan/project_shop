import { Injectable } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

class Sub {

  @IsNotEmpty()
  @IsEmail()
  email : string 

  @IsNotEmpty()
  @IsString()
  nickname : string
}

@Injectable()
export class NewAccessPayloadDto {

  @IsNotEmpty()
  @IsString()
  access_token : string

  @IsNotEmpty()
  @IsString()
  userId : string

  @IsNotEmpty()
  @Type(() => Sub)
  sub : Sub


}