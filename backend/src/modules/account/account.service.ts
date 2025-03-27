import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginUserDto,
  RegisterUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  ResponseLoginUserDto,
} from './dto';
import { UsersService } from '../users/users.service';
import { ErrorLog } from 'src/errors';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly userService: UsersService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async regeisterUser(dto: RegisterUserDto): Promise<ResponseLoginUserDto> {
    const userExistCheck = await this.userService.findUserByEmail(dto.email);
    if (userExistCheck) {
      throw new BadRequestException(ErrorLog.USER_EXIST);
    }
    dto.password = await this.userService.passwordHash(dto.password);
    const newUser = await this.userService.createUser(dto);
    const newWorkspace = await this.workspaceService.createWorkspace({
      user_id: newUser.User_id,
    });
    // await newWorkspace.$create('page', {
    //   title: 'NewPage',
    //   parent_page_id: null,
    //   depth: 0,
    // });
    await this.workspaceService.createPage({
      parent_page_id: null,
      depth: 0,
      workspace_id: newWorkspace.Workspace_id,
    });
    const token: string = await this.userService.generateToken(newUser);
    return { email: dto.email, name: dto.name, token: token };
  }

  async loginUser(dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    const userExistCheck = await this.userService.findUserByEmail(dto.email);
    if (!userExistCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const passwordCheck: boolean = await this.userService.passwordVerify(
      userExistCheck.password_hash,
      dto.password,
    );
    if (!passwordCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const token: string = await this.userService.generateToken(userExistCheck);
    return {
      email: userExistCheck.email,
      name: userExistCheck.name,
      token: token,
    };
  }

  async destroyUser(user_id: number): Promise<number> {
    return this.userService.deleteUser(user_id);
  }

  async sendPasswordResetLink(dto: RequestPasswordResetDto): Promise<string> {
    const userExistCheck = await this.userService.findUserByEmail(dto.email);
    if (!userExistCheck) {
      throw new BadRequestException(ErrorLog.USER_NOT_EXIST);
    }
    const resetToken: string =
      await this.userService.generateToken(userExistCheck);
    const resetUrl: string = `https://myapp/reset-password?token=${resetToken}`;
    return resetUrl;
  }

  async resetPassword(dto: ResetPasswordDto, user_id: number) {
    dto.newPassword = await this.userService.passwordHash(dto.newPassword);
    return this.userService.updateUserPassword(dto.newPassword, user_id);
  }
}
