import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TransactionsStorage {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Operation)
  operations: Operation[] = [];

  addOperation(operation: Operation) {
    this.operations.push(operation);
  }

  getCount() {
    return this.operations.length;
  }
}

export class Operation {
  @IsString()
  @IsOptional()
  userAction?: string;

  @IsString()
  command: 'update' | 'create' | 'delete' | 'change-position';

  @ValidateNested()
  @Type((op) => {
    switch (op?.object?.command) {
      case 'update':
        return UpdateOperationArgs;
      case 'create':
        return CreateOperationArgs;
      case 'change-position':
        return ChangePosOperationArgs;
      case 'delete':
        return DeleteOperationArgs;
      default:
        throw new Error(`Unknown command: ${op?.object.command}`);
    }
  })
  args:
    | UpdateOperationArgs
    | CreateOperationArgs
    | DeleteOperationArgs
    | ChangePosOperationArgs;
}

class UpdateOperationArgs {
  @IsNumber()
  block_id: number;

  @IsOptional()
  @IsString()
  content?: string; // !!! FIX
}

class ChangePosOperationArgs {
  @IsNumber()
  block_id: number;

  @IsNumber()
  pointer_to: number;
}

export class CreateOperationArgs {
  @IsString()
  @IsIn(['text', 'bulleted list'])
  type: string;

  @IsOptional()
  @IsNumber()
  pointer_to: number | null;

  @IsOptional()
  @IsString()
  content?: string; // !!! FIX
}

class DeleteOperationArgs {
  @IsNumber()
  block_id: number;
}
