import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TeamMember } from '@bayan/shared';
import { AuthenticatedClient, CurrentClient } from '../../common/decorators/current-client.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamService } from './team.service';

@ApiTags('team')
@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @Post('sites/:siteId/team')
  @ApiOperation({ summary: 'Add a team member to a site' })
  create(
    @CurrentClient() client: AuthenticatedClient,
    @Param('siteId') siteId: string,
    @Body() dto: CreateTeamMemberDto,
  ): Promise<TeamMember> {
    return this.teamService.create(siteId, client.id, dto);
  }

  @Public()
  @Get('sites/:siteId/team')
  @ApiOperation({ summary: 'List team members for a site' })
  findAll(@Param('siteId') siteId: string): Promise<TeamMember[]> {
    return this.teamService.findAllForSite(siteId);
  }

  @ApiBearerAuth()
  @Patch('team/:id')
  @ApiOperation({ summary: 'Update a team member' })
  update(
    @CurrentClient() client: AuthenticatedClient,
    @Param('id') id: string,
    @Body() dto: UpdateTeamMemberDto,
  ): Promise<TeamMember> {
    return this.teamService.update(id, client.id, dto);
  }

  @ApiBearerAuth()
  @Delete('team/:id')
  @ApiOperation({ summary: 'Remove a team member' })
  remove(@CurrentClient() client: AuthenticatedClient, @Param('id') id: string): Promise<void> {
    return this.teamService.remove(id, client.id);
  }
}
