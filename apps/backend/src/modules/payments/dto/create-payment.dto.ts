import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';

export class CardSourceDto {
  @ApiProperty({ example: 'SA CardHolder' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '4111111111111111' })
  @IsString()
  number!: string;

  @ApiProperty({ example: '123' })
  @IsString()
  cvc!: string;

  @ApiProperty({ example: '09' })
  @IsString()
  month!: string;

  @ApiProperty({ example: '2030' })
  @IsString()
  year!: string;
}

export class CreatePaymentDto {
  @ApiProperty()
  @IsUUID()
  bookingId!: string;

  @ApiProperty({ example: 'https://mybusiness.bayan.sa/booking/confirmation' })
  @IsString()
  callbackUrl!: string;

  @ApiProperty({ type: CardSourceDto })
  @ValidateNested()
  @Type(() => CardSourceDto)
  source!: CardSourceDto;
}
