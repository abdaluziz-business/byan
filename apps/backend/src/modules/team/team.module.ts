import { Module } from '@nestjs/common';
import { SitesModule } from '../sites/sites.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [SitesModule],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
