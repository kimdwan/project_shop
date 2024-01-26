import { Injectable } from "@nestjs/common";
import { IsIn, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

enum Sex {
  man,
  woman
}

enum Jobs {
  student,
  employee,
  developer,
  free
}


@Injectable()
export class UpdateDto {

  @IsOptional()
  @IsString()
  @MaxLength(6)
  first_name : string

  @IsOptional()
  @IsString()
  @MaxLength(15)
  last_name : string

  @IsOptional()
  @IsIn(["man","woman"])
  gender : Sex

  @IsOptional()
  @IsNumber()
  @Min(0)
  age : number

  @IsOptional()
  @IsString()
  @IsIn(["student","employee","developer","free"])
  job : Jobs

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary : number

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone : string
}