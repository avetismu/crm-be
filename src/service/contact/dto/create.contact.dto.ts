import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "../contact.entity";
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from "src/utils/enum.utils";
import { UUID } from "crypto";

export class CreateContactDTO {

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    company: UUID;

    @ApiProperty({enum: CountryCode})
    country_phone_area_code: CountryCode;
    
    @ApiProperty()
    phone_number: string;

    @ApiProperty({enum: CountryCode})
    whatsapp_country_phone_area_code: CountryCode;

    @ApiProperty()
    whatsapp_number: string;

    @ApiProperty()
    wechat_id: string;
    
    @ApiProperty()
    address: string;
    
    @ApiProperty()
    city: string;
    
    @ApiProperty()
    province: string;
    
    @ApiProperty({enum: CountryCode})
    country: CountryCode;

    @ApiProperty({enum: ContactType})
    contact_type: ContactType;

    @ApiProperty()
    last_contact: Date;

    @ApiProperty({enum: ContactMethod})
    contact_method: ContactMethod;
}