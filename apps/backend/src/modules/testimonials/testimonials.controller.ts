import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Testimonial } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { TestimonialsService } from './testimonials.service';

@ApiTags('testimonials')
@Controller()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('sites/:siteId/testimonials')
  @ApiOperation({ summary: 'Submit a testimonial for approval (public site form)' })
  submit(@Param('siteId') siteId: string, @Body() dto: CreateTestimonialDto): Promise<Testimonial> {
    return this.testimonialsService.submit(siteId, dto);
  }

  @Public()
  @Get('sites/:siteId/testimonials')
  @ApiOperation({ summary: 'List approved testimonials for a site (live site)' })
  findApproved(@Param('siteId') siteId: string): Promise<Testimonial[]> {
    return this.testimonialsService.findApprovedForSite(siteId);
  }

  @ApiBearerAuth()
  @Get('sites/:siteId/testimonials/admin')
  @ApiOperation({ summary: 'List all testimonials (approved and pending) for the site owner' })
  findAll(@CurrentClient() client: AuthenticatedClient, @Param('siteId') siteId: string): Promise<Testimonial[]> {
    return this.testimonialsService.findAllForSite(siteId, client.id);
  }

  @ApiBearerAuth()
  @Patch('testimonials/:id')
  @ApiOperation({ summary: 'Approve or edit a testimonial' })
  update(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ): Promise<Testimonial> {
    return this.testimonialsService.update(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('testimonials/:id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.testimonialsService.remove(id, client.id);
  }
}
