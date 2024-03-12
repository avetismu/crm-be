import { PartialType } from "@nestjs/swagger";
import { CreateContactDto } from "./create.contact.dto";

export class updateContactDto extends PartialType(CreateContactDto) {}