import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactMessage } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('contact')
@Controller('sites/:siteId/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Submit the contact form on a live site' })
  submit(@Param('siteId') siteId: string, @Body() dto: CreateContactMessageDto): Promise<ContactMessage> {
    return this.contactService.submit(siteId, dto);
  }

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List contact messages received for a site' })
  findAll(@CurrentClient() client: AuthenticatedClient, @Param('siteId') siteId: string): Promise<ContactMessage[]> {
    return this.contactService.findAllForSite(siteId, client.id);
  }
}
