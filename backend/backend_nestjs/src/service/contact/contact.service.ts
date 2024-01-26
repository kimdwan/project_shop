import { Injectable } from '@nestjs/common';
import { AuthContactService } from 'src/auth/auth.service.contact';
import { ContactDto } from 'src/dto';

@Injectable()
export class ContactService {
  constructor(private auth:AuthContactService) {}

  async send_contact(dto:ContactDto) : Promise<string> {
    try{
      const messages = await this.auth.add_contact(dto)
      return messages
    }
    catch (err) {
      throw new Error(err)
    }
  }

}
