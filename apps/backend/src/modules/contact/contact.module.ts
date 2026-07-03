import { Module } from '@nestjs/common';
import { SitesModule } from '../sites/sites.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [SitesModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
