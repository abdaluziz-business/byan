import { Module } from '@nestjs/common';
import { R2Module } from '../../integrations/r2/r2.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [R2Module],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
