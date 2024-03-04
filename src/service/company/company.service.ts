import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDTO } from './dto/create.company.dto';
import { Timestamp } from 'typeorm';
import { UUID } from 'crypto';

@Injectable()
export class CompanyService {
  constructor(
    @Inject('COMPANY_REPOSITORY')
    private companyRepository: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  async findOne(uuid: UUID): Promise<Company> { return this.companyRepository.findOne({where : {"uuid" : uuid} }); }

  async create(createCompanyDTO: CreateCompanyDTO): Promise<Company> {
    try {
      const company = new Company();
      company.companyName = createCompanyDTO.companyName;
      company.description = createCompanyDTO.description;
      company.email = createCompanyDTO.email;
      company.countryPhoneAreaCode = createCompanyDTO.countryPhoneAreaCode;
      company.phoneNumber = createCompanyDTO.phoneNumber;
      company.whatsappCountryPhoneAreaCode = createCompanyDTO.whatsappCountryPhoneAreaCode;
      company.whatsappNumber = createCompanyDTO.whatsappNumber;
      company.wechatId = createCompanyDTO.wechatId;
      company.streetAddress = createCompanyDTO.streetAddress;
      company.city = createCompanyDTO.city;
      company.province = createCompanyDTO.province;
      company.country = createCompanyDTO.country;
      company.contactType = createCompanyDTO.contactType;
      company.createdAt = new Date();

      return await this.companyRepository.save(company);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default CompanyService;