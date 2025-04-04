import { IsNumber, IsOptional, IsString } from 'class-validator';

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
  col_position: number;
  @IsNumber()
  row_position: number;
  @IsNumber()
  width: number;
  @IsNumber()
  page_id: number;
}
