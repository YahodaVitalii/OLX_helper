import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateProductFinanceDto } from './create-product-finance.dto';

export class UpdateProductFinanceDto extends PartialType(
  CreateProductFinanceDto,
) {
  @ApiProperty({
    description: 'The ID of the financial record to be updated',
    example: 1,
  })
  @IsNumber()
  id?: number;
}
