import { ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus } from '@bayan/shared';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateBookingStatusDto {
  @ApiPropertyOptional({ enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
