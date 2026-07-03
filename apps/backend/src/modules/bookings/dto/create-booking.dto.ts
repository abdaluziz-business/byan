import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsISO8601, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: 'نورة القحطاني' })
  @IsString()
  @MinLength(2)
  clientName!: string;

  @ApiProperty({ example: 'noura@example.com' })
  @IsEmail()
  clientEmail!: string;

  @ApiProperty({ example: '+966501234567' })
  @IsString()
  clientPhone!: string;

  @ApiProperty({ example: '2026-07-10' })
  @IsISO8601()
  date!: string;

  @ApiProperty({ example: '14:30' })
  @IsString()
  time!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
