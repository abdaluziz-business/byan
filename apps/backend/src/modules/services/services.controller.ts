import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Service } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBearerAuth()
  @Post('sites/:siteId/services')
  @ApiOperation({ summary: 'Add a service to a site' })
  create(
    @CurrentClient() client: AuthenticatedClient,
    @Param('siteId') siteId: string,
    @Body() dto: CreateServiceDto,
  ): Promise<Service> {
    return this.servicesService.create(siteId, client.id, dto);
  }

  @Public()
  @Get('sites/:siteId/services')
  @ApiOperation({ summary: 'List services for a site (used by admin and the live site)' })
  findAll(@Param('siteId') siteId: string): Promise<Service[]> {
    return this.servicesService.findAllForSite(siteId);
  }

  @Public()
  @Get('services/:id')
  @ApiOperation({ summary: 'Get a single service' })
  findOne(@Param('id') id: string): Promise<Service> {
    return this.servicesService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch('services/:id')
  @ApiOperation({ summary: 'Update a service' })
  update(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.servicesService.remove(id, client.id);
  }
}
