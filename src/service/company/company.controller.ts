import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { API_VERSION } from 'src/utils/app.constants.utils';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create.company.dto';
import { UUID } from 'crypto';

const COMPANIES_PATH = 'companies';

@Controller(API_VERSION + COMPANIES_PATH)
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get('all')
    getAll(): Promise<Company[]> {
        return this.companyService.findAll();
    }

    @Get('by_name/:name')
    getByName(@Param('name') name: string): Promise<Company[]> {
        return this.companyService.findByName(name);
    }

    @Post('create')
    create(@Body() createCompanyDTO: CreateCompanyDto): Promise<Company> {
        return this.companyService.create(createCompanyDTO);
    }

    @Delete(':uuid')
    remove(@Param('uuid') uuid: UUID) {
        return this.companyService.remove(uuid);
    }
}

export default CompanyController;