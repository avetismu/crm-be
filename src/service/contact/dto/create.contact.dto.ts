import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "../entities/contact.entity";
import { ContactMethod, ContactType, CountryCode, CountryPhoneAreaCode } from "src/utils/enum.utils";
import { UUID } from "crypto";

export class CreateContactDto {

    @ApiProperty()
    first_name: string;

    @ApiProperty()
    last_name: string;

    @ApiProperty()
    description: string | null;

    @ApiProperty()
    email: string | null;
    
    @ApiProperty()
    company: UUID | null;

    @ApiProperty({enum: CountryCode})
    country_phone_area_code: CountryCode | null;
    
    @ApiProperty()
    phone_number: string | null;

    @ApiProperty({enum: CountryCode})
    whatsapp_country_phone_area_code: CountryCode | null;

    @ApiProperty()
    whatsapp_number: string | null;

    @ApiProperty()
    wechat_id: string | null;
    
    @ApiProperty()
    address: string | null;
    
    @ApiProperty()
    city: string | null;
    
    @ApiProperty()
    province: string | null;
    
    @ApiProperty({enum: CountryCode})
    country: CountryCode | null;

    @ApiProperty({enum: ContactType})
    contact_type: ContactType | null;

    @ApiProperty()
    last_contact: Date | null;

    @ApiProperty({enum: ContactMethod})
    contact_method: ContactMethod | null;

}
