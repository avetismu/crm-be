import { ApiProperty } from "@nestjs/swagger";
import { ContactMethod, ContactType, CountryCode } from "src/utils/enum.utils";

export class CreateCompanyDTO {
    @ApiProperty()
    companyName: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: CountryCode })
    countryPhoneAreaCode: CountryCode;

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty({ enum: CountryCode })
    whatsappCountryPhoneAreaCode: CountryCode;

    @ApiProperty()
    whatsappNumber: string;

    @ApiProperty()
    wechatId: string;

    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    city: string;

    @ApiProperty()
    province: string;

    @ApiProperty({ enum: CountryCode })
    country: CountryCode;

    @ApiProperty({ enum: ContactType })
    contactType: ContactType;
}