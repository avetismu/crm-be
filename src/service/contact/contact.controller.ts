import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { API_VERSION } from 'src/utils/app.constants.utils';
import { CreateContactDTO } from './dto/create.contact.dto';

const CONTACTS_PATH = 'contacts';

@Controller(API_VERSION + CONTACTS_PATH)
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  

  @Get('all')
  getAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Post('create')
  create(@Body() createContactDTO : CreateContactDTO): Promise<Contact> {
    return this.contactService.create(createContactDTO);
  }
}
