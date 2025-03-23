import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto, RegisterUserDto, ResponseLoginUserDto } from './dto';

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
}
