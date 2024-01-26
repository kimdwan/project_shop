import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class AccessJwtDto {

  @IsNotEmpty()
  @IsString()
  access_token : string
}