import { Module } from '@nestjs/common';
import { MoyasarModule } from '../../integrations/moyasar/moyasar.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [MoyasarModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
