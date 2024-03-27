import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { FindOperator, ILike, Repository, Timestamp } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create.contact.dto';
import { UUID, randomUUID } from 'crypto';
import CompanyService from '../company/company.service';
import { CreateCompanyDto } from '../company/dto/create.company.dto';
import { Company } from '../company/entities/company.entity';
import { UpdateCompanyDto } from '../company/dto/update.company.entity';
import { UpdateContactDto } from './dto/update.contact.dto';
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


  findByName(name: string): Promise<Contact[]> {
    return this.contactRepository.find({ where: [
      { firstName : ILike(`%${name}%`)},
      { lastName : ILike(`%${name}%`)}
    ]});
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

      if(createContactDTO.company){
        await this.addContactToCompany(createContactDTO.company, contact);
        contact.company = await this.companyService.findOne(createContactDTO.company);
      }
      

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
     return this.contactRepository.findOne({ where: { uuid: uuid }, relations: ['company']});
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
    async update(uuid: UUID, updateContactDTO: UpdateContactDto): Promise<Contact> {
      console.log('updateContactDTO', updateContactDTO)
      const contactToUpdate = await this.contactRepository.findOne({ where: { uuid: uuid }, relations : ['company']});
      if (!contactToUpdate) {
        throw new Error('Contact not found');
      }

      contactToUpdate.firstName = updateContactDTO.first_name ?? contactToUpdate.firstName;
      contactToUpdate.lastName = updateContactDTO.last_name ?? contactToUpdate.lastName;
      contactToUpdate.description = updateContactDTO.description ?? contactToUpdate.description;
      contactToUpdate.email = updateContactDTO.email ?? contactToUpdate.email;
      contactToUpdate.countryPhoneAreaCode = updateContactDTO.country_phone_area_code ?? contactToUpdate.countryPhoneAreaCode;
      contactToUpdate.phoneNumber = updateContactDTO.phone_number ?? contactToUpdate.phoneNumber;
      contactToUpdate.whatsappCountryPhoneAreaCode = updateContactDTO.whatsapp_country_phone_area_code ?? contactToUpdate.whatsappCountryPhoneAreaCode;
      contactToUpdate.whatsappNumber = updateContactDTO.whatsapp_number ?? contactToUpdate.whatsappNumber;
      contactToUpdate.wechatId = updateContactDTO.wechat_id ?? contactToUpdate.wechatId;
      contactToUpdate.streetAddress = updateContactDTO.address ?? contactToUpdate.streetAddress;
      contactToUpdate.city = updateContactDTO.city ?? contactToUpdate.city;
      contactToUpdate.province = updateContactDTO.province ?? contactToUpdate.province;
      contactToUpdate.country = updateContactDTO.country ?? contactToUpdate.country;
      contactToUpdate.contactType = updateContactDTO.contact_type ?? contactToUpdate.contactType;
      contactToUpdate.lastContact = updateContactDTO.last_contact ?? contactToUpdate.lastContact;
      contactToUpdate.contactMethod = updateContactDTO.contact_method ?? contactToUpdate.contactMethod;

      if (updateContactDTO.company){
        await this.addContactToCompany(updateContactDTO.company, contactToUpdate);
        contactToUpdate.company = await this.companyService.findOne(updateContactDTO.company);
      }
      else{
        if(contactToUpdate.company)
          this.removeContactFromCompany(contactToUpdate.company.uuid, contactToUpdate)  

        contactToUpdate.company = null;
      }
      

      contactToUpdate.updatedAt = new Date();

      console.log('contactToUpdate', contactToUpdate)
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

    async removeContactFromCompany(uuid : UUID | null | undefined, contact : Contact) : Promise<Company> {
      // Assign Company
      if (uuid) {
        const company = await this.companyService.findOne(uuid);
        let contacts = company.contacts;
        console.log('company', company)
        if(contacts){
          contacts.filter(item => item !== contact)
        }
        
        const updateCompanyDto = new UpdateCompanyDto();
        updateCompanyDto.contacts = contacts.map((contact) => contact.uuid)

        await this.companyService.update(company.uuid, updateCompanyDto);
        return company;
      }
    }

}