import { Injectable } from "@nestjs/common";
import { IsNotEmpty, IsString } from "class-validator";

@Injectable()
export class AccessDto {
  
  @IsNotEmpty()
  @IsString()
  computer_number : string


  @IsNotEmpty()
  @IsString()
  access_token : string
}