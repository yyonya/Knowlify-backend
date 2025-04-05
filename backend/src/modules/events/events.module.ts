import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TokenModule } from '../token/token.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { EventsService } from './events.service';

@Module({
  imports: [TokenModule, WorkspaceModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
