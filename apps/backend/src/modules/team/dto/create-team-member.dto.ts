import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { SocialLinks } from '@bayan/shared';
import { IsBoolean, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty({ example: 'سارة أحمد' })
  @IsString()
  @MinLength(2)
  nameAr!: string;

  @ApiProperty({ example: 'Sarah Ahmed' })
  @IsString()
  @MinLength(2)
  nameEn!: string;

  @ApiProperty({ example: 'Founder & Lead Designer' })
  @IsString()
  role!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  socialLinks?: SocialLinks;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isOwner?: boolean;
}
