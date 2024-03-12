import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { FindOperator, Repository, Timestamp } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create.contact.dto';
import { UUID, randomUUID } from 'crypto';
import CompanyService from '../company/company.service';
import { CreateCompanyDto } from '../company/dto/create.company.dto';
import { Company } from '../company/entities/company.entity';
import { UpdateCompanyDto } from '../company/dto/update.company.entity';
@Injectable()
/**
 * Service class for managing contacts.
 */
export class ContactService {
  constructor(
    @Inject('CONTACT_REPOSITORY')
    private contactRepository: Repository<Contact>,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService
  ) {}

  /**
   * Retrieves all contacts.
   * @returns A promise that resolves to an array of contacts.
   */
  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find({relations: ['company']});
  }

  /**
   * Creates a new contact.
   * @param createContactDTO - The data for creating a contact.
   * @returns A promise that resolves to the created contact.
   */
  async create(createContactDTO: CreateContactDto): Promise<Contact> {
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
      contact.contactType = createContactDTO.contact_type;
      contact.lastContact = createContactDTO.last_contact;
      contact.contactMethod = createContactDTO.contact_method;
      contact.createdAt = new Date();

      await this.addContactToCompany(createContactDTO.company, contact);
      contact.company = await this.companyService.findOne(createContactDTO.company);

      return await this.contactRepository.save(contact);

    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
    * Retrieves a contact by its UUID.
    * @param uuid - The UUID of the contact.
    * @returns A promise that resolves to the found contact, or undefined if not found.
    */
    async findOne(uuid: UUID): Promise<Contact | undefined> {
     return this.contactRepository.findOne({ where: { uuid: uuid }});
    }

    /**
    * Removes a contact by its UUID.
    * @param uuid - The UUID of the contact to remove.
    * @returns A promise that resolves to the removed contact.
    */
    async remove(uuid: UUID): Promise<Contact> {
     const contactToRemove = await this.contactRepository.findOne({ where: { uuid: uuid }});
     if (!contactToRemove) {
      throw new Error('Contact not found');
     }
     return this.contactRepository.remove(contactToRemove);
    }

    /**
    * Updates a contact by its UUID.
    * @param uuid - The UUID of the contact to update.
    * @param updateContactDTO - The data for updating the contact.
    * @returns A promise that resolves to the updated contact.
    */
    async update(uuid: UUID, updateContactDTO: Partial<CreateContactDto>): Promise<Contact> {
     const contactToUpdate = await this.contactRepository.findOne({ where: { uuid: uuid }});
     if (!contactToUpdate) {
      throw new Error('Contact not found');
     }
     Object.assign(contactToUpdate, updateContactDTO);
     return this.contactRepository.save(contactToUpdate);
    }

    async addContactToCompany(uuid : UUID | null | undefined, contact : Contact) : Promise<Company> {
      // Assign Company
      if (uuid) {
        const company = await this.companyService.findOne(uuid);
        let contacts = company.contacts;

        if(contacts){
          contacts.push(contact)
        }
        else{
          company.contacts = [contact]
        }
        
        const updateCompanyDto = new UpdateCompanyDto();
        updateCompanyDto.contacts = contacts.map((contact) => contact.uuid)

        await this.companyService.update(company.uuid, updateCompanyDto);
        return company;
      }
    }

}