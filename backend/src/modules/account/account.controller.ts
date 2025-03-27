import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  ResponseLoginUserDto,
} from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';
import { AccountService } from './account.service';

@Controller('api/users')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('registration')
  registerUsers(@Body() dto: RegisterUserDto): Promise<ResponseLoginUserDto> {
    return this.accountService.regeisterUser(dto);
  }

  @Post('login')
  loginUsers(@Body() dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    return this.accountService.loginUser(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('destroy')
  destroyUsers(@Req() req): Promise<number> {
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;
    return this.accountService.destroyUser(user_id);
  }

  @Post('request-password-reset')
  async requestPasswordResets(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<string> {
    return this.accountService.sendPasswordResetLink(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reset-password')
  async resetPasswords(@Req() req, @Body() dto: ResetPasswordDto) {
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;
    return this.accountService.resetPassword(dto, user_id);
  }
}
