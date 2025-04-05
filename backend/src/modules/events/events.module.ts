import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TokenModule } from '../token/token.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [TokenModule, WorkspaceModule],
  providers: [EventsGateway],
})
export class EventsModule {}
