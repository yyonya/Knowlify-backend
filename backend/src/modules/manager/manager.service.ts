import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { CreatePageDto } from './dto';
import { ErrorLog } from 'src/errors';

@Injectable()
export class ManagerService {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async CreateNewPage(dto: CreatePageDto, user_id: number) {
    let workspace_id = dto.workspace_id;
    if (!workspace_id && user_id === undefined) {
      throw new BadRequestException(ErrorLog.WORKSPACE_OR_USER_REQUIRED);
    }
    if (!workspace_id) {
      const workspace =
        await this.workspaceService.findWorkspaceByUserId(user_id); // TODO CHECK LOGIC ROLE ?
      if (!workspace) {
        throw new BadRequestException(ErrorLog.WORKSPACE_NOT_EXIST);
      }
      workspace_id = workspace.Workspace_id;
    }
    const newPage = await this.workspaceService.createPage(dto, workspace_id);
    await this.workspaceService.createWorkspaceMember({
      user_id: user_id,
      page_id: newPage.Page_id,
      role: 'owner',
    });
    return newPage;
  }

  // async saveTransactions(dto: SaveTransactionsDto, user_id: number) {
  //   const page_id = dto.page_id;
  //   const right = await this.workspaceService.checkRightToEditPage(
  //     user_id,
  //     page_id,
  //   );
  //   if (!right) {
  //     throw new BadRequestException(ErrorLog.RIGHTS_FAILTURE);
  //   }
  //   const transactions = dto.transactions;
  //   const results: number[] = [];
  //   for (const transaction of transactions) {
  //     for (const operation of transaction.operations) {
  //       // TODO ошибки обработка
  //       const result = await this.processOperation(operation, page_id);
  //       results.push(result);
  //     }
  //   }
  //   return results;
  // }

  // async processOperation(operation: TransactionOperationDto, page_id: number) {
  //   switch (operation.command) {
  //     case 'create':
  //       return this.createBlock(operation.args as CreateOperationArgs, page_id);
  //     default:
  //       throw new BadRequestException(ErrorLog.COMMAND_FAILTURE);
  //   }
  // }

  // async createBlock(
  //   args: CreateOperationArgs,
  //   page_id: number,
  // ): Promise<number> {
  //   const newBlock = await this.workspaceService.createBlock({
  //     position: args.position,
  //     type: args.type,
  //     page_id: page_id,
  //   });
  //   return newBlock.Block_id;
  // }
}
