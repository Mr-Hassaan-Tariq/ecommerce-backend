import { PartialType } from "@nestjs/mapped-types";
import { VariantEntity } from "../entities/variant.entity";

export class CreateVariantDto extends PartialType(VariantEntity){}
