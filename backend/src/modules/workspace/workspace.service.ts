import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';
import {
  CreateBlockDto,
  CreatePageDto,
  CreateWorkspaceDto,
  CreateWorkspaceMemberDto,
} from '../manager/dto';
import { WorkspaceMembers } from 'src/models/workspace-members.model';
import { User } from 'src/models/user.model';
import { Blocks } from 'src/models/blocks.model';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
    @InjectModel(Pages)
    private readonly pageRepository: typeof Pages,
    @InjectModel(WorkspaceMembers)
    private readonly workspaceMembersRepository: typeof WorkspaceMembers,
    @InjectModel(Blocks)
    private readonly blocksRepository: typeof Blocks,
  ) {}

  async findWorkspaceByUserId(user_id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({ where: { user_id: user_id } });
  }

  async checkRightToEditPage(user_id: number, page_id): Promise<boolean> {
    const membership = await this.workspaceMembersRepository.findOne({
      where: {
        user_id,
        page_id,
      },
      attributes: ['role'],
    });
    if (!membership) {
      return false;
    }
    return ['owner', 'editor'].includes(membership.role.toLowerCase());
  }

  async getUserPagesByUserId(user_id: number): Promise<Pages[]> {
    return this.pageRepository.findAll({
      include: [
        {
          model: User,
          as: 'users',
          where: { User_id: user_id },
          through: { attributes: [] },
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

  async createPage(dto: CreatePageDto, workspace_id: number): Promise<Pages> {
    return this.pageRepository.create({
      title: 'NewPage',
      parent_page_id: dto.parent_page_id, // TODO CHECK LOGIC
      depth: dto.depth, // TODO CHECK LOGIC
      workspace_id: workspace_id,
    });
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

  async createBlock(dto: CreateBlockDto): Promise<Blocks> {
    return this.blocksRepository.create({
      type: dto.type,
      position: dto.position,
      page_id: dto.page_id,
    });
  }
}
