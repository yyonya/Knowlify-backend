import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';
import { JwtStrategy } from 'src/strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Workspace, Pages]),
    forwardRef(() => UsersModule),
  ],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, JwtStrategy],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
