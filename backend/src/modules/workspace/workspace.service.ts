import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Workspace } from 'src/models/workspace.model';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace)
    private readonly workspaceRepository: typeof Workspace,
  ) {}

  async createWorkspace(name: string, user_id: number): Promise<Workspace> {
    return this.workspaceRepository.create({
      name: name,
      user_id: user_id,
    });
  }
}
