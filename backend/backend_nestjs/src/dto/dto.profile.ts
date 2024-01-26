import { Injectable } from "@nestjs/common";
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

@Injectable()
export class ProfileDto {

  @IsNotEmpty()
  @IsEmail()
  email : string

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  nickname : string 

  @IsNotEmpty()
  @IsString()
  @MaxLength(6)
  first_name : string

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  last_name : string

  @IsNotEmpty()
  @IsIn(["man",'woman'])  
  gender : string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  age : number

  @IsNotEmpty()
  @IsIn(["student","employee","developer","free"])
  job : string

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  salary : number

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  phone : string
}