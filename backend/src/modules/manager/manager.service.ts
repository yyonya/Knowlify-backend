import { BadRequestException, Injectable } from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import {
  CreateOperationArgs,
  CreatePageDto,
  SaveTransactionsDto,
  TransactionOperationDto,
} from './dto';
import { ErrorLog } from 'src/errors';

@Injectable()
export class ManagerService {
  constructor(private readonly workspaceService: WorkspaceService) {}

  async CreateNewPage(dto: CreatePageDto, user_id?: number) {
    return this.workspaceService.createPage(dto, user_id);
  }

  async saveTransactions(dto: SaveTransactionsDto, user_id: number) {
    const page_id = dto.page_id;
    const right = await this.workspaceService.checkRightToEditPage(
      user_id,
      page_id,
    );
    if (!right) {
      throw new BadRequestException(ErrorLog.RIGHTS_FAILTURE);
    }
    const transactions = dto.transactions;
    const results: number[] = [];
    for (const transaction of transactions) {
      for (const operation of transaction.operations) {
        // TODO ошибки обработка
        const result = await this.processOperation(user_id, operation, page_id);
        results.push(result);
      }
    }
    return results;
  }

  async processOperation(
    user_id: number,
    operation: TransactionOperationDto,
    page_id: number,
  ) {
    switch (operation.command) {
      //   case 'update':
      //     return this.updateBlock(user_id, operation.block_id, operation.args);
      case 'create':
        return this.createBlock(operation.args as CreateOperationArgs, page_id);
      //   case 'delete':
      //     return this.deleteBlock(user_id, operation.block_id);
      default:
        throw new BadRequestException(ErrorLog.COMMAND_FAILTURE);
    }
  }

  async createBlock(
    args: CreateOperationArgs,
    page_id: number,
  ): Promise<number> {
    if (!['text', 'bulleted list'].includes(args.type)) {
      throw new BadRequestException(ErrorLog.BlOCK_FAILTURE);
    }

    if (args.position < 0) {
      // FIX LOGIC
      throw new BadRequestException(ErrorLog.BlOCK_FAILTURE);
    }
    const newBlock = await this.workspaceService.createBlock({
      position: args.position,
      type: args.type,
      page_id: page_id,
    });
    return newBlock.Block_id;
  }
}
