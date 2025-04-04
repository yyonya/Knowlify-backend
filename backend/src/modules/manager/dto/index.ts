import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateWorkspaceDto {
  @IsNumber()
  user_id: number;
}

export class CreatePageDto {
  @IsOptional()
  @IsNumber()
  parent_page_id: number | null;
  @IsNumber()
  depth: number;
  @IsOptional()
  @IsNumber()
  workspace_id?: number | null;
}

export class CreateWorkspaceMemberDto {
  @IsNumber()
  user_id: number;
  @IsNumber()
  page_id: number;
  @IsString()
  role: string;
}

export class CreateBlockDto {
  //TODO перенести в другое дто (или нет)
  @IsNumber()
  type: string;
  @IsNumber()
  position: number;
  @IsNumber()
  page_id: number;
}

export class SaveTransactionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions: TransactionDto[];
  @IsNumber()
  page_id: number;
}

export class TransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionOperationDto)
  operations: TransactionOperationDto[];
  @IsOptional()
  @IsString()
  userAction?: string;
}

export class TransactionOperationDto {
  @IsString()
  command: 'update' | 'create' | 'delete';

  @ValidateNested()
  @Type((op) => {
    switch (op?.object?.command) {
      case 'update':
        return UpdateOperationArgs;
      case 'create':
        return CreateOperationArgs;
      case 'delete':
        return DeleteOperationArgs;
      default:
        throw new Error(`Unknown command: ${op?.object.command}`);
    }
  })
  args: UpdateOperationArgs | CreateOperationArgs | DeleteOperationArgs;
}

class UpdateOperationArgs {
  @IsNumber()
  block_id: number;

  @IsOptional()
  @IsString()
  content?: string; // !!! FIX
}

export class CreateOperationArgs {
  @IsString()
  @IsIn(['text', 'bulleted list'])
  type: string;
  @IsNumber()
  @Min(1)
  position: number;
}

class DeleteOperationArgs {
  @IsNumber()
  block_id: number;
}
