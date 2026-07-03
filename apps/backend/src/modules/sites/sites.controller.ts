import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Site } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SitesService } from './sites.service';

@ApiTags('sites')
@Controller()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @ApiBearerAuth()
  @Post('sites')
  @ApiOperation({ summary: 'Create a new site for the authenticated client' })
  create(@CurrentClient() client: AuthenticatedClient, @Body() dto: CreateSiteDto): Promise<Site> {
    return this.sitesService.create(client.id, dto);
  }

  @ApiBearerAuth()
  @Get('sites')
  @ApiOperation({ summary: 'List all sites owned by the authenticated client' })
  findAll(@CurrentClient() client: AuthenticatedClient): Promise<Site[]> {
    return this.sitesService.findAllForClient(client.id);
  }

  @ApiBearerAuth()
  @Get('sites/:id')
  @ApiOperation({ summary: 'Get a single owned site' })
  findOne(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<Site> {
    return this.sitesService.findOneOwned(id, client.id);
  }

  @ApiBearerAuth()
  @Patch('sites/:id')
  @ApiOperation({ summary: 'Update theme, sections, language, domain or publish state' })
  update(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateSiteDto,
  ): Promise<Site> {
    return this.sitesService.update(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('sites/:id')
  @ApiOperation({ summary: 'Delete an owned site' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.sitesService.remove(id, client.id);
  }

  @Public()
  @Get('public/sites/by-domain/:domain')
  @ApiOperation({ summary: 'Fetch a published site (with content) by its custom domain — used by the live site' })
  getByDomain(@Param('domain') domain: string) {
    return this.sitesService.getPublicSiteByDomain(domain);
  }

  @Public()
  @Get('public/sites/:id')
  @ApiOperation({ summary: 'Fetch a published site (with content) by id — used by the live site' })
  getById(@Param('id') id: string) {
    return this.sitesService.getPublicSiteById(id);
  }
}
