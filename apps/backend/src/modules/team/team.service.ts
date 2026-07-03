import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamMember } from '@bayan/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { SitesService } from '../sites/sites.service';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { toTeamMemberDto } from './team.mapper';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sitesService: SitesService,
  ) {}

  async create(siteId: string, clientId: string, dto: CreateTeamMemberDto): Promise<TeamMember> {
    await this.sitesService.ensureOwnership(siteId, clientId);

    const member = await this.prisma.teamMember.create({
      data: { ...dto, socialLinks: dto.socialLinks as object, siteId },
    });

    return toTeamMemberDto(member);
  }

  async findAllForSite(siteId: string): Promise<TeamMember[]> {
    const members = await this.prisma.teamMember.findMany({ where: { siteId }, orderBy: { createdAt: 'asc' } });
    return members.map(toTeamMemberDto);
  }

  async update(id: string, clientId: string, dto: UpdateTeamMemberDto): Promise<TeamMember> {
    await this.ensureOwnership(id, clientId);
    const member = await this.prisma.teamMember.update({
      where: { id },
      data: { ...dto, socialLinks: dto.socialLinks as object },
    });
    return toTeamMemberDto(member);
  }

  async remove(id: string, clientId: string): Promise<void> {
    await this.ensureOwnership(id, clientId);
    await this.prisma.teamMember.delete({ where: { id } });
  }

  private async ensureOwnership(memberId: string, clientId: string): Promise<void> {
    const member = await this.prisma.teamMember.findUnique({ where: { id: memberId }, include: { site: true } });

    if (!member) {
      throw new NotFoundException('Team member not found');
    }

    if (member.site.clientId !== clientId) {
      throw new ForbiddenException('You do not have access to this team member');
    }
  }
}
