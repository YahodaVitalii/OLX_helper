import { PartialType } from '@nestjs/swagger';
import { CreateLaptopDto } from './create-laptop.dto';

export class UpdateLaptopDto extends PartialType(CreateLaptopDto) {}
