import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { JwtStrategy } from 'src/strategy';
import { UsersModule } from '../users/users.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  imports: [UsersModule, WorkspaceModule],
  controllers: [ManagerController],
  providers: [ManagerService, JwtStrategy],
})
export class ManagerModule {}
