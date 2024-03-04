import { Body, Controller, Get, Post } from '@nestjs/common';
import { API_VERSION } from 'src/utils/app.constants.utils';
import { CompanyService } from '../company/company.service';
import { Company } from '../company/company.entity';
import { CreateCompanyDTO } from '../company/dto/create.company.dto';

const COMPANIES_PATH = 'companies';

@Controller(API_VERSION + COMPANIES_PATH)
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get('all')
    getAll(): Promise<Company[]> {
        return this.companyService.findAll();
    }

    @Post('create')
    create(@Body() createCompanyDTO: CreateCompanyDTO): Promise<Company> {
        return this.companyService.create(createCompanyDTO);
    }
}

export default CompanyController;