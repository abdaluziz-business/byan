import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Client } from '@bayan/shared';
import { CurrentClient, AuthenticatedClient } from '../../common/decorators/current-client.decorator';
import { ClientsService } from './clients.service';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated client profile' })
  getProfile(@CurrentClient() client: AuthenticatedClient): Promise<Client> {
    return this.clientsService.findById(client.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated client profile' })
  updateProfile(@CurrentClient() client: AuthenticatedClient, @Body() dto: UpdateClientDto): Promise<Client> {
    return this.clientsService.update(client.id, dto);
  }
}
