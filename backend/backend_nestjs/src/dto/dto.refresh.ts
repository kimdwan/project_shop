import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class RefreshDto {

  @IsNotEmpty()
  @IsString()
  computer_number : string

  @IsNotEmpty()
  @IsString()
  refresh_token : string
}