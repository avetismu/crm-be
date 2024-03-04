import { Injectable, Inject } from '@nestjs/common';
import { Repository, Timestamp } from 'typeorm';
import { Contact } from './contact.entity';
import { CreateContactDTO } from './dto/create.contact.dto';
import { UUID, randomUUID } from 'crypto';
import CompanyService from '../company/company.service';
@Injectable()
/**
 * Service class for managing contacts.
 */
export class ContactService {
  constructor(
    @Inject('CONTACT_REPOSITORY')
    private contactRepository: Repository<Contact>,

    private readonly companyService: CompanyService
  ) {}

  /**
   * Retrieves all contacts.
   * @returns A promise that resolves to an array of contacts.
   */
  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  /**
   * Creates a new contact.
   * @param createContactDTO - The data for creating a contact.
   * @returns A promise that resolves to the created contact.
   */
  async create(createContactDTO: CreateContactDTO): Promise<Contact> {
    try {
      const contact = new Contact();
      contact.uuid = randomUUID();
      contact.firstName = createContactDTO.first_name;
      contact.lastName = createContactDTO.last_name;
      contact.description = createContactDTO.description;
      contact.email = createContactDTO.email;
      contact.countryPhoneAreaCode = createContactDTO.country_phone_area_code;
      contact.phoneNumber = createContactDTO.phone_number;
      contact.whatsappCountryPhoneAreaCode = createContactDTO.whatsapp_country_phone_area_code;
      contact.whatsappNumber = createContactDTO.whatsapp_number;
      contact.wechatId = createContactDTO.wechat_id;
      contact.streetAddress = createContactDTO.address;
      contact.city = createContactDTO.city;
      contact.province = createContactDTO.province;
      contact.country = createContactDTO.country;
      contact.contact_type = createContactDTO.contact_type;
      contact.lastContact = createContactDTO.last_contact;
      contact.contactMethod = createContactDTO.contact_method;
      contact.createdAt = new Date();

      // Assign Company
      if (createContactDTO.company) {
        contact.company = await this.companyService.findOne(createContactDTO.company);
      }

      return await this.contactRepository.save(contact);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}