import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto, RegisterUserDto, ResponseLoginUserDto } from './dto';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('registration')
  registerUsers(@Body() dto: RegisterUserDto): Promise<ResponseLoginUserDto> {
    return this.userService.regeisterUser(dto);
  }
  @Post('login')
  loginUsers(@Body() dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    return this.userService.loginUser(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('destroy')
  test(@Req() req) {
    // eslint-disable-next-line
    const user_id: number = req.user.user_id;
    return this.userService.destroyUser(user_id);
  }
}
