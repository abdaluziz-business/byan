import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Booking } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@ApiTags('bookings')
@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('bookings')
  @ApiOperation({ summary: 'Create a booking from the live site' })
  create(@Body() dto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(dto);
  }

  @ApiBearerAuth()
  @Get('sites/:siteId/bookings')
  @ApiOperation({ summary: 'List bookings for a site' })
  findAll(@CurrentClient() client: AuthenticatedClient, @Param('siteId') siteId: string): Promise<Booking[]> {
    return this.bookingsService.findAllForSite(siteId, client.id);
  }

  @ApiBearerAuth()
  @Patch('bookings/:id/status')
  @ApiOperation({ summary: 'Update a booking status or payment status' })
  updateStatus(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateStatus(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('bookings/:id')
  @ApiOperation({ summary: 'Delete a booking' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.bookingsService.remove(id, client.id);
  }
}
