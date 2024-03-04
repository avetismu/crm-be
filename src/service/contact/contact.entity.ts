import { UUID } from 'crypto';
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from 'src/utils/enum.utils';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { Company } from '../company/company.entity';

@Entity('contact')
export class Contact {

    @PrimaryGeneratedColumn('uuid')
    uuid: UUID;

    @Column('text', {'name': 'first_name'})
    firstName: string;

    @Column('text', {'name': 'last_name'})
    lastName: string;

    @Column('text', {'name': 'description'})
    description: string;

    @ManyToOne(() => Company, (company) => company.uuid,{nullable : true})
    @JoinTable()
    company: Company;

    @Column('text', {'name': 'email'})
    email: string;

    @Column('enum', {'name': 'country_phone_area_code', 'enum': CountryCode, 'unique' : false})
    countryPhoneAreaCode: CountryCode;    

    @Column('text', {'name': 'phone_number'})
    phoneNumber: string;

    @Column('enum', {'name': 'whatsapp_country_phone_area_code', 'enum': CountryCode})
    whatsappCountryPhoneAreaCode: CountryCode;  

    @Column('text', {'name': 'whatsapp_number'})
    whatsappNumber: string;

    @Column('text', {'name': 'wechat_id'})
    wechatId: string;

    @Column('text', {'name': 'street_address'})
    streetAddress: string;

    @Column('text', {'name': 'city'})
    city: string;

    @Column('text', {'name': 'province'})
    province: string;

    @Column('enum', {'name': 'country', 'enum': CountryCode})
    country: CountryCode;  

    @Column('enum', {'name': 'contact_type', 'enum': ContactType, 'default': ContactType.CUSTOMER})
    contact_type: ContactType;

    @Column('timestamptz', {'name': 'last_contact', 'default': null, nullable : true})
    lastContact: Date;

    @Column('text', {'name': 'contact_method', default: ContactMethod.OTHER})
    contactMethod: ContactMethod;

    @Column('timestamptz', {'name': 'created_at', 'default': null, nullable : true})
    createdAt: Date

    @Column('timestamptz', {'name': 'updated_at', 'default': null, nullable : true})
    updatedAt: Date

}