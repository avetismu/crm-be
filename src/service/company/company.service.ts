import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { ILike, Like, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { Timestamp } from 'typeorm';
import { UUID } from 'crypto';
import { Contact } from '../contact/entities/contact.entity';
import { ContactService } from '../contact/contact.service';
import { updateContactDto } from '../contact/dto/update.contact.dto';
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
    Object.assign(companyToUpdate, updateCompanyDto);
    return this.companyRepository.save(companyToUpdate);
   }

   async remove(uuid: UUID): Promise<Company> {
    const companyToRemove = await this.companyRepository.findOne({ where: { uuid: uuid }, relations : ['contacts']});
    if (!companyToRemove) {
     throw new Error('Contact not found');
    }
    return this.companyRepository.remove(companyToRemove);
   }

   async removeCompanyFromContacts(company : Company){
    company.contacts.map((contact) => {
      const update = new updateContactDto();
      update.company = null
      this.companyRepository.update(contact.uuid, update)
    });

   }

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
      
      company =  await this.update(company.uuid, updateParentDto);
      return parentEntity;
    }
  }

}



export default CompanyService;