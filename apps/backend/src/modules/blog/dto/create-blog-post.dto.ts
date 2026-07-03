import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'كيف تختار الخدمة المناسبة' })
  @IsString()
  @MinLength(2)
  titleAr!: string;

  @ApiProperty({ example: 'How to choose the right service' })
  @IsString()
  @MinLength(2)
  titleEn!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  contentAr!: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  contentEn!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiPropertyOptional({ description: 'Publish immediately on creation', default: false })
  @IsOptional()
  @IsBoolean()
  publishNow?: boolean;
}
