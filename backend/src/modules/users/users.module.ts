import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { TokenModule } from 'src/modules/token/token.module';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { JwtStrategy } from 'src/strategy';

@Module({
  imports: [SequelizeModule.forFeature([User]), TokenModule, WorkspaceModule],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
