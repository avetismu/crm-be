import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { API_VERSION } from 'src/utils/app.constants.utils';
import { CreateContactDto } from './dto/create.contact.dto';
import { updateContactDto } from './dto/update.contact.dto';
import { UUID } from "crypto";

const CONTACTS_PATH = 'contacts';

@Controller(API_VERSION + CONTACTS_PATH)
export class ContactsController {
  constructor(private readonly contactService: ContactService) {}

  @Post('create')
  create(@Body() createContactDTO : CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDTO);
  }

  @Get('all')
  findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: UUID) {
    return this.contactService.findOne(uuid);
  }

  @Patch(':uuid')
  update(@Param('uuid') uuid: UUID, @Body() updateContactDTO: updateContactDto) {
    return this.contactService.update(uuid, updateContactDTO);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: UUID) {
    return this.contactService.remove(uuid);
  }

}
