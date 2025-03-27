import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { Pages } from 'src/models/pages.model';
import { CreatePageDto, CreateWorkspaceDto } from './dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
    @InjectModel(Pages)
    private readonly pageRepository: typeof Pages,
  ) {}

  async createWorkspace(dto: CreateWorkspaceDto): Promise<Workspace> {
    return this.workspaceRepository.create({
      name: 'MyWorkspace',
      user_id: dto.user_id,
    });
  }
  async createPage(dto: CreatePageDto): Promise<Pages> {
    return this.pageRepository.create({
      title: 'NewPage',
      parent_page_id: dto.parent_page_id, // TODO CHECK LOGIC
      depth: dto.depth, // TODO CHECK LOGIC
      workspace_id: dto.workspace_id,
    });
  }
}
