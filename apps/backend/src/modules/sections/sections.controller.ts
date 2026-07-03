import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { SectionCatalogEntry } from './section-catalog';
import { SectionsService } from './sections.service';

@ApiTags('sections')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Public()
  @Get('catalog')
  @ApiOperation({ summary: 'List available section keys and their variants for the site builder UI' })
  getCatalog(): SectionCatalogEntry[] {
    return this.sectionsService.getCatalog();
  }
}
