import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TransportModule } from 'src/transport/transport.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [TransportModule],
})
export class PaymentsModule {}
