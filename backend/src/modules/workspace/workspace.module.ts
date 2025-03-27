import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';

@Module({
  imports: [SequelizeModule.forFeature([Workspace, Pages])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
