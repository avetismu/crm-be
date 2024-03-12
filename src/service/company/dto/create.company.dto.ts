import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { ContactMethod, ContactType, CountryCode } from "src/utils/enum.utils";

export class CreateCompanyDto {
    @ApiProperty({nullable : false})
    company_name: string;

    @ApiProperty({nullable : true})
    description: string;

    @ApiProperty({nullable : true})
    email: string;

    @ApiProperty({ enum: CountryCode, nullable : true})
    country_phone_area_code: CountryCode;

    @ApiProperty({nullable : true})
    phone_number: string;

    @ApiProperty({ enum: CountryCode , nullable : true})
    whatsapp_country_phone_area_code: CountryCode;

    @ApiProperty({nullable : true})
    whatsapp_number: string;

    @ApiProperty({nullable : true})
    wechat_id: string;

    @ApiProperty({nullable : true})
    street_address: string;

    @ApiProperty({nullable : true})
    city: string;

    @ApiProperty({nullable : true})
    province: string;

    @ApiProperty({ enum: CountryCode, nullable : true})
    country: CountryCode;

    @ApiProperty({ enum: ContactType, nullable : true })
    contact_type: ContactType;

    @ApiProperty({ enum: ContactMethod, nullable : true })
    contact_method: ContactMethod;

    @ApiProperty({ nullable : true })
    last_contact: Date; 

    @ApiProperty({nullable : true})
    contacts:UUID[];

    @ApiProperty({nullable : true})
    parent_entity: UUID;

    @ApiProperty({nullable : true})
    sub_entities: UUID[];

}