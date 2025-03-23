import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';
import { CreateWorkspaceDto } from './dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
  ) {}

  async createWorkspace(
    dto: CreateWorkspaceDto,
    user_id: number,
  ): Promise<Workspace> {
    return this.workspaceRepository.create({
      name: dto.name,
      all_size: dto.all_size,
      page_count: dto.page_count,
      user_id: user_id,
    });
  }
}
