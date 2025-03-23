import { IsNumber, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  name: string;

  @IsNumber()
  all_size: number;

  @IsNumber()
  page_count: number;
}
