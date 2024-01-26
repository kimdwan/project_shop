import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class UserIdDto {

  @IsString()
  @IsNotEmpty()
  userId : string
}