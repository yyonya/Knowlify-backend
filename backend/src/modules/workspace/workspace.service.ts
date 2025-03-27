import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';
import { CreatePageDto, CreateWorkspaceDto } from './dto';
import { ErrorLog } from 'src/errors';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
    @InjectModel(Pages)
    private readonly pageRepository: typeof Pages,
  ) {}

  async findWorkspaceByUserId(user_id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({ where: { user_id: user_id } });
  }

  async createWorkspace(dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspaceRepository.create({
      name: 'MyWorkspace',
      user_id: dto.user_id,
    });
  }
  async createPage(dto: CreatePageDto, user_id?: number): Promise<Pages> {
    let workspace_id = dto.workspace_id;
    if (!workspace_id && user_id === undefined) {
      throw new BadRequestException(ErrorLog.WORKSPACE_OR_USER_REQUIRED);
    }
    if (!workspace_id) {
      const workspace = await this.findWorkspaceByUserId(user_id!);
      if (!workspace) {
        throw new BadRequestException(ErrorLog.WORKSPACE_NOT_EXIST);
      }
      workspace_id = workspace.Workspace_id;
    }
    return this.pageRepository.create({
      title: 'NewPage',
      parent_page_id: dto.parent_page_id, // TODO CHECK LOGIC
      depth: dto.depth, // TODO CHECK LOGIC
      workspace_id: workspace_id,
    });
  }
}
