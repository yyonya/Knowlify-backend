import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from 'src/modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import configuration from 'src/configuration';
import { User } from 'src/models/user.model';
import { TokenModule } from 'src/modules/token/token.module';
import { Workspace } from 'src/models/workspace.model';
import { WorkspaceModule } from 'src/modules/workspace/workspace.module';
import { Pages } from 'src/models/pages.model';
import { AccountModule } from '../account/account.module';
import { ManagerModule } from '../manager/manager.module';
import { WorkspaceMembers } from 'src/models/workspace-members.model';
import { Invitations } from 'src/models/invitations.model';
import { Blocks } from 'src/models/blocks.model';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        synchronize: true,
        autoLoadModels: true,
        models: [User, Workspace, Pages, WorkspaceMembers, Invitations, Blocks],
      }),
    }),
    UsersModule,
    WorkspaceModule,
    TokenModule,
    AccountModule,
    ManagerModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
