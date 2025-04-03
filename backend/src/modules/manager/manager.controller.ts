import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { CreatePageDto, SaveTransactionsDto } from './dto';
import { ManagerService } from './manager.service';

@Controller('api/manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-page')
  async createPages(@Req() req, @Body() dto: CreatePageDto) {
    // TODO Response
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;
    return this.managerService.CreateNewPage(dto, user_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('save-transactions')
  async saveTransactions(@Req() req, @Body() dto: SaveTransactionsDto) {
    // TODO Response
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;

    return this.managerService.saveTransactions(dto, user_id);
  }
}
