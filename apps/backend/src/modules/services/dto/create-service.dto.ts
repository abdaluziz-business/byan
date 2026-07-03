import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'قص شعر' })
  @IsString()
  @MinLength(2)
  nameAr!: string;

  @ApiProperty({ example: 'Haircut' })
  @IsString()
  @MinLength(2)
  nameEn!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 30, description: 'Duration in minutes' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duration!: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isInPerson?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedMemberId?: string;
}
