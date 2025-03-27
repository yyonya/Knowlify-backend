import { IsNumber, IsOptional } from 'class-validator';

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
  @IsNumber()
  workspace_id: number;
}
