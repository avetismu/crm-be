import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ILike, Like, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Timestamp } from 'typeorm';
import { UUID, randomUUID } from 'crypto';
import { Contact } from '../contact/entities/contact.entity';
import { ContactService } from '../contact/contact.service';
import { UpdateContactDto } from '../contact/dto/update.contact.dto';
import { UpdateCompanyDto } from './dto/update.company.entity';
import { CreateCompanyDto } from './dto/create.company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_REPOSITORY')
    private companyRepository: Repository<Company>,

    @Inject(forwardRef(() => ContactService))
    private contactService: ContactService
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find({relations : ['contacts', 'subEntities', 'parentEntity']});
  }

  async findOne(uuid: UUID): Promise<Company> { return this.companyRepository.findOne({where : {"uuid" : uuid}, relations : ['contacts', 'subEntities', 'parentEntity']}); }

  async findByName(name : string) : Promise<Company[]> { return this.companyRepository.find({ where: { companyName : ILike(`%${name}%`) } }); }

  async create(createCompanyDTO: CreateCompanyDto): Promise<Company> {
    try {
      const company = new Company();
      company.uuid = randomUUID();
      company.companyName = createCompanyDTO.company_name;
      company.description = createCompanyDTO.description;
      company.email = createCompanyDTO.email;
      company.countryPhoneAreaCode = createCompanyDTO.country_phone_area_code;
      company.phoneNumber = createCompanyDTO.phone_number;
      company.whatsappCountryPhoneAreaCode = createCompanyDTO.whatsapp_country_phone_area_code;
      company.whatsappNumber = createCompanyDTO.whatsapp_number;
      company.wechatId = createCompanyDTO.wechat_id;
      company.streetAddress = createCompanyDTO.street_address;
      company.city = createCompanyDTO.city;
      company.province = createCompanyDTO.province;
      company.country = createCompanyDTO.country;
      company.contactMethod = createCompanyDTO.contact_method;
      company.contactType = createCompanyDTO.contact_type;
      company.lastContact = createCompanyDTO.last_contact;
      company.contacts = [];

      company.createdAt = new Date();

      company.parentEntity = await this.addCompanyToParentEntity(createCompanyDTO.parent_entity, company)

      return await this.companyRepository.save(company);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async update(uuid: UUID, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const companyToUpdate = await this.companyRepository.findOne({ where: { uuid: uuid }, relations: ['contacts', 'subEntities', 'parentEntity']});
    if (!companyToUpdate) {
     throw new Error('Contact not found');
    }

    if (updateCompanyDto.parent_entity){
      await this.addCompanyToParentEntity(updateCompanyDto.parent_entity, companyToUpdate);
      companyToUpdate.parentEntity = await this.companyRepository.findOne({where : { uuid : updateCompanyDto.parent_entity}, relations : ['parentEntity']});
    }
    else{
      if(companyToUpdate.parentEntity)
        await this.removeCompanyFromParentEntity(companyToUpdate.parentEntity.uuid, companyToUpdate);

      companyToUpdate.parentEntity = null;
    }
    
    companyToUpdate.companyName = updateCompanyDto.company_name ?? companyToUpdate.companyName;
    companyToUpdate.description = updateCompanyDto.description ?? companyToUpdate.description;
    companyToUpdate.email = updateCompanyDto.email ?? companyToUpdate.email;
    companyToUpdate.countryPhoneAreaCode = updateCompanyDto.country_phone_area_code ?? companyToUpdate.countryPhoneAreaCode;
    companyToUpdate.phoneNumber = updateCompanyDto.phone_number ?? companyToUpdate.phoneNumber;
    companyToUpdate.whatsappCountryPhoneAreaCode = updateCompanyDto.whatsapp_country_phone_area_code ?? companyToUpdate.whatsappCountryPhoneAreaCode;
    companyToUpdate.whatsappNumber = updateCompanyDto.whatsapp_number ?? companyToUpdate.whatsappNumber;
    companyToUpdate.wechatId = updateCompanyDto.wechat_id ?? companyToUpdate.wechatId;
    companyToUpdate.streetAddress = updateCompanyDto.street_address ?? companyToUpdate.streetAddress;
    companyToUpdate.city = updateCompanyDto.city ?? companyToUpdate.city;
    companyToUpdate.province = updateCompanyDto.province ?? companyToUpdate.province;
    companyToUpdate.country = updateCompanyDto.country ?? companyToUpdate.country;
    companyToUpdate.contactType = updateCompanyDto.contact_type ?? companyToUpdate.contactType;
    companyToUpdate.lastContact = updateCompanyDto.last_contact ?? companyToUpdate.lastContact;
    companyToUpdate.contactMethod = updateCompanyDto.contact_method ?? companyToUpdate.contactMethod;
    companyToUpdate.updatedAt = new Date();

    return this.companyRepository.save(companyToUpdate);
   }

   async remove(uuid: UUID): Promise<Company> {
    const companyToRemove = await this.companyRepository.findOne({ where: { uuid: uuid }, relations : ['contacts']});
    if (!companyToRemove) {
     throw new Error('Contact not found');
    }
    return this.companyRepository.remove(companyToRemove);
   }

  /**
   * Removes a company from all associated contacts.
   * @param company - The company to be removed from contacts.
   */
   async removeCompanyFromContacts(company : Company){
    company.contacts.map((contact) => {
      const update = new UpdateContactDto();
      update.company = null
      this.companyRepository.update(contact.uuid, update)
    });

   }

  /**
   * Removes a company from its parent entity.
   * @param uuid - The UUID of the parent entity.
   * @param company - The company to be removed from the parent entity.
   * @returns A promise that resolves to the updated company object.
   */
   async removeCompanyFromParentEntity(uuid : UUID | null | undefined, company : Company) : Promise<Company> {

    const parentEntity = await this.companyRepository.findOne({where  : {uuid : uuid}, relations : ['subEntities']});

    parentEntity.subEntities = parentEntity.subEntities.filter((subEntities) => subEntities.uuid !== company.uuid);

    this.companyRepository.save(parentEntity);

    return company
   }

  /**
   * Adds a company to a parent entity.
   * 
   * @param uuid - The UUID of the parent entity.
   * @param company - The company to be added.
   * @returns A Promise that resolves to the updated parent entity.
   */
   async addCompanyToParentEntity(uuid : UUID | null | undefined, company : Company) : Promise<Company> {
    // Assign Company
    if (uuid) {
      const parentEntity = await this.companyRepository.findOne({where  : {uuid : uuid}});
      let subEntities = parentEntity.subEntities ?? [];

      if(subEntities){
        subEntities.push(company)
      }
      else{
        subEntities = [company]
      }

      const updateParentDto = new UpdateCompanyDto();
      updateParentDto.sub_entities = subEntities.map((entity) => entity.uuid)
      
      company =  await this.update(parentEntity.uuid, updateParentDto);
      return parentEntity;
    }
  }

}



export default CompanyService;