import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateClientDto {
  @ApiPropertyOptional({ example: 'Bayan Business' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  businessName?: string;
}
