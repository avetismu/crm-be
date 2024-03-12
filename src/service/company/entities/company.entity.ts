import { UUID } from "crypto";
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from "src/utils/enum.utils";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Contact } from "../../contact/entities/contact.entity";

@Entity('company')
export class Company {

    @PrimaryGeneratedColumn('uuid')
    uuid: UUID;

    @Column('text', {'name': 'company_name'})
    companyName: string;

    @Column('text', {'name': 'description', nullable : true})
    description: string;

    @Column('text', {'name': 'email', nullable : true})
    email: string;

    @Column('enum', {'name': 'country_phone_area_code', 'enum': CountryCode, nullable : true})
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

    @Column('enum', {'name': 'contact_type', 'enum': ContactType, 'default': ContactType.CUSTOMER})
    contactType: ContactType;

    @Column('timestamptz', {'name': 'last_contact', 'default': null, nullable : true})
    lastContact: Date;

    @Column('text', {'name': 'contact_method', default: ContactMethod.OTHER})
    contactMethod: ContactMethod;

    @ManyToOne(() => Company, (company) => company.subEntities,{nullable : true})
    @JoinTable()
    parentEntity: Company

    @OneToMany(() => Company, (company) => company.parentEntity, {nullable : true})
    @JoinTable()
    subEntities: Company[]

    @OneToMany(() => Contact, (contact) => contact.company, {nullable : true})
    @JoinTable()
    contacts: Contact[]

    @Column('timestamptz', {'name': 'created_at', 'default': null, nullable : true})
    createdAt: Date

    @Column('timestamptz', {'name': 'updated_at', 'default': null, nullable : true})
    updatedAt: Date
}