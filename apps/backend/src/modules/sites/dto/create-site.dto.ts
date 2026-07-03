import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language, SectionsConfig } from '@bayan/shared';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { SiteTheme } from '@bayan/shared';

export class CreateSiteDto {
  @ApiProperty({ description: 'Full theme configuration (colors, fonts, logo, site name)' })
  @IsObject()
  theme!: SiteTheme;

  @ApiProperty({ description: 'Enabled sections with variant + display order' })
  @IsObject()
  sections!: SectionsConfig;

  @ApiPropertyOptional({ enum: Language, default: Language.AR })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ example: 'my-business.bayan.sa' })
  @IsOptional()
  @IsString()
  domain?: string;
}
