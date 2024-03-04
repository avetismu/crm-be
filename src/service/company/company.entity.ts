import { UUID } from "crypto";
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from "src/utils/enum.utils";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Contact } from "../contact/contact.entity";

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn('uuid')
    uuid: UUID;

    @Column('text', {'name': 'company_name'})
    companyName: string;

    @Column('text', {'name': 'description'})
    description: string;

    @Column('text', {'name': 'email'})
    email: string;

    @Column('enum', {'name': 'country_phone_area_code', 'enum': CountryCode})
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
    contactType: ContactType;

    @Column('timestamptz', {'name': 'last_contact', 'default': null, nullable : true})
    lastContact: Date;

    @Column('text', {'name': 'contact_method', default: ContactMethod.OTHER})
    contactMethod: ContactMethod;

    @ManyToOne(() => Company, (company) => company.uuid,{nullable : true})
    @JoinTable()
    parentEntity: Company

    @OneToMany(() => Company, (company) => company.uuid, {nullable : true})
    @JoinTable()
    subEntities: Company[]

    @OneToMany(() => Contact, (contact) => contact.uuid, {nullable : true})
    @JoinTable()
    contact: Contact[]

    @Column('timestamptz', {'name': 'created_at', 'default': null, nullable : true})
    createdAt: Date

    @Column('timestamptz', {'name': 'updated_at', 'default': null, nullable : true})
    updatedAt: Date
}