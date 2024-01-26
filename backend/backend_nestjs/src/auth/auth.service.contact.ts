import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma";
import { ContactDto } from "src/dto";

@Injectable()
export class AuthContactService {
  constructor(private prisma:PrismaService) {}

  async add_contact (dto:ContactDto) : Promise<string> {
    try {
      await this.prisma.contact.create({
        data : {
          first_name : dto.first_name,
          last_name : dto.last_name,
          email : dto.email,
          messages : dto.messages
        }
      })
      return "좋은 의견 감사합니다."
      
    }
    catch(err) {
      throw new Error(err)
    }
  }
}