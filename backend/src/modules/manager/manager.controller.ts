import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CreatePageDto } from './dto';

@Controller('api/manager')
export class ManagerController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-page')
  async createPages(@Req() req, @Body() dto: CreatePageDto) {
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;
    return this.workspaceService.createPage(dto, user_id);
  }
}
