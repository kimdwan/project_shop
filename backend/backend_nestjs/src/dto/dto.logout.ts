import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class LogOutDto {

  @IsString()
  @IsNotEmpty()
  computer_number : string

  @IsNotEmpty()
  @IsString()
  access_token : string
}