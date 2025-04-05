import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  type: string;

  @IsBoolean()
  is_head: boolean;

  @IsOptional()
  @IsNumber()
  pointer_to: number | null;

  @IsBoolean()
  is_tail: boolean;

  @IsOptional()
  @IsNumber()
  database_y: number | null;

  @IsOptional()
  @IsNumber()
  database_x: number | null;

  @IsNumber()
  page_id: number;
}
