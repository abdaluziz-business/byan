import { SocialLinks, TeamMember as TeamMemberDto } from '@bayan/shared';
import { TeamMember as TeamMemberEntity } from '@prisma/client';

export function toTeamMemberDto(member: TeamMemberEntity): TeamMemberDto {
  return {
    id: member.id,
    siteId: member.siteId,
    nameAr: member.nameAr,
    nameEn: member.nameEn,
    role: member.role,
    bio: member.bio,
    image: member.image,
    socialLinks: member.socialLinks as unknown as SocialLinks | null,
    isOwner: member.isOwner,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}
