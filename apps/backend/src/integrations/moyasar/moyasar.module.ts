import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MoyasarService } from './moyasar.service';

@Module({
  imports: [HttpModule],
  providers: [MoyasarService],
  exports: [MoyasarService],
})
export class MoyasarModule {}
