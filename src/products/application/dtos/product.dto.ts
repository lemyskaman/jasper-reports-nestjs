import { ApiProperty } from '@nestjs/swagger';

/**
 * Product Data Transfer Object
 * Used for returning product data to clients
 */
export class ProductDto {
  @ApiProperty({ description: 'The unique identifier of the product' })
  id?: number;

  @ApiProperty({ description: 'The name of the product' })
  name!: string;

  @ApiProperty({ description: 'The price of the product' })
  price!: number;

  @ApiProperty({ description: 'The description of the product', required: false })
  description?: string;
}