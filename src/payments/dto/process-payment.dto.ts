import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  orderId: string;

  @IsString()
  currency: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

class ItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
