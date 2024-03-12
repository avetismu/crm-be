import { UUID } from 'crypto';
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from 'src/utils/enum.utils';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from 'typeorm';
import { Company } from '../../company/entities/company.entity';

@Entity('contact')
export class Contact {

    @PrimaryGeneratedColumn('uuid')
    uuid: UUID;

    @Column('text', {'name': 'first_name'})
    firstName: string;

    @Column('text', {'name': 'last_name'})
    lastName: string;

    @Column('text', {'name': 'description', nullable : true})
    description: string;

    @ManyToOne(() => Company, (company) => company.contacts, {nullable : true})
    @JoinTable()
    company: Company;

    @Column('text', {'name': 'email'})
    email: string;

    @Column('enum', {'name': 'country_phone_area_code', 'enum': CountryCode, 'unique' : false, nullable : true})
    countryPhoneAreaCode: CountryCode;    

    @Column('text', {'name': 'phone_number', nullable : true})
    phoneNumber: string;

    @Column('enum', {'name': 'whatsapp_country_phone_area_code', 'enum': CountryCode, nullable : true})
    whatsappCountryPhoneAreaCode: CountryCode;  

    @Column('text', {'name': 'whatsapp_number', nullable : true})
    whatsappNumber: string;

    @Column('text', {'name': 'wechat_id', nullable : true})
    wechatId: string;

    @Column('text', {'name': 'street_address', nullable : true})
    streetAddress: string;

    @Column('text', {'name': 'city', nullable : true})
    city: string;

    @Column('text', {'name': 'province', nullable : true})
    province: string;

    @Column('enum', {'name': 'country', 'enum': CountryCode, nullable : true})
    country: CountryCode;  

    @Column('enum', {'name': 'contact_type', 'enum': ContactType, 'default': ContactType.CUSTOMER, nullable : true})
    contactType: ContactType;

    @Column('timestamptz', {'name': 'last_contact', 'default': null, nullable : true})
    lastContact: Date;

    @Column('text', {'name': 'contact_method', default: ContactMethod.OTHER, nullable : true})
    contactMethod: ContactMethod;

    @Column('timestamptz', {'name': 'created_at', 'default': null, nullable : true})
    createdAt: Date

    @Column('timestamptz', {'name': 'updated_at', 'default': null, nullable : true})
    updatedAt: Date

}