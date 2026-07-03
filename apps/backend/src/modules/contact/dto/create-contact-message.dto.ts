import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'خالد سالم' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'khaled@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+966501234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'أرغب بالاستفسار عن الأسعار' })
  @IsString()
  @MinLength(2)
  message!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  attachment?: string;
}
