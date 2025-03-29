import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';
import {
  CreatePageDto,
  CreateWorkspaceDto,
  CreateWorkspaceMemberDto,
} from '../manager/dto';
import { ErrorLog } from 'src/errors';
import { WorkspaceMembers } from 'src/models/workspace-members.model';
import { User } from 'src/models/user.model';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
    @InjectModel(Pages)
    private readonly pageRepository: typeof Pages,
    @InjectModel(WorkspaceMembers)
    private readonly workspaceMembersRepository: typeof WorkspaceMembers,
  ) {}

  async findWorkspaceByUserId(user_id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({ where: { user_id: user_id } });
  }

  async getUserPagesByUserId(user_id: number): Promise<Pages[]> {
    return this.pageRepository.findAll({
      include: [
        {
          model: User, // Модель для связи
          as: 'users', // Псевдоним ассоциации
          where: { User_id: user_id }, // Условие фильтрации
          through: { attributes: [] }, // Настройки промежуточной таблицы
        },
      ],
    });
  }

  async createWorkspace(dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspaceRepository.create({
      name: 'MyWorkspace',
      user_limit: 5,
      user_id: dto.user_id,
    });
  }

  async createPage(dto: CreatePageDto, user_id?: number): Promise<Pages> {
    let workspace_id = dto.workspace_id;
    if (!workspace_id && user_id === undefined) {
      throw new BadRequestException(ErrorLog.WORKSPACE_OR_USER_REQUIRED);
    }
    if (!workspace_id) {
      const workspace = await this.findWorkspaceByUserId(user_id!); // TODO CHECK LOGIC ROLE ?
      if (!workspace) {
        throw new BadRequestException(ErrorLog.WORKSPACE_NOT_EXIST);
      }
      workspace_id = workspace.Workspace_id;
    }
    const newPage = await this.pageRepository.create({
      title: 'NewPage',
      parent_page_id: dto.parent_page_id, // TODO CHECK LOGIC
      depth: dto.depth, // TODO CHECK LOGIC
      workspace_id: workspace_id,
    });
    await this.createWorkspaceMember({
      user_id: user_id!,
      page_id: newPage.Page_id,
      role: 'owner',
    });
    return newPage;
  }

  async createWorkspaceMember(
    dto: CreateWorkspaceMemberDto,
  ): Promise<WorkspaceMembers> {
    return this.workspaceMembersRepository.create({
      user_id: dto.user_id,
      page_id: dto.page_id,
      role: dto.role,
    });
  }
}
