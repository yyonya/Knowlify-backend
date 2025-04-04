import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  providers: [EventsGateway],
})
export class EventsModule {}
