import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { TokenModule } from 'src/token/token.module';
import { WorkspaceModule } from 'src/workspace/workspace.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), TokenModule, WorkspaceModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
