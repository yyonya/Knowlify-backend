import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { UsersModule } from '../users/users.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { JwtStrategy } from 'src/strategy';

@Module({
  imports: [UsersModule, WorkspaceModule],
  controllers: [AccountController],
  providers: [AccountService, JwtStrategy],
})
export class AccountModule {}
