import { Injectable } from '@nestjs/common';
import { SECTION_CATALOG, SectionCatalogEntry } from './section-catalog';

@Injectable()
export class SectionsService {
  getCatalog(): SectionCatalogEntry[] {
    return SECTION_CATALOG;
  }
}
