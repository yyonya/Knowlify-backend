import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';
import {
  LoginUserDto,
  RegisterUserDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  ResponseLoginUserDto,
} from './dto';
import { ErrorLog } from 'src/errors';
import { TokenService } from 'src/modules/token/token.service';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async passwordHash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async passwordVerify(hash: string, password: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findUserById(User_id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { User_id: User_id } });
  }

  async regeisterUser(dto: RegisterUserDto): Promise<ResponseLoginUserDto> {
    const userExistCheck = await this.findUserByEmail(dto.email);
    if (userExistCheck) {
      throw new BadRequestException(ErrorLog.USER_EXIST);
    }
    dto.password = await this.passwordHash(dto.password);
    const newUser = await this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password_hash: dto.password,
      storage_limit: 2048,
      storage: 0,
    });
    const newWorkspace = await this.workspaceService.createWorkspace({
      user_id: newUser.User_id,
    });
    await this.workspaceService.createPage({
      parent_page_id: null,
      depth: 0,
      workspace_id: newWorkspace.Workspace_id,
    });
    const token: string = await this.tokenService.generateJwtToken(
      newUser.User_id,
    );
    return { email: dto.email, name: dto.name, token: token };
  }

  async loginUser(dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    const userExistCheck = await this.findUserByEmail(dto.email);
    if (!userExistCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const passwordCheck: boolean = await this.passwordVerify(
      userExistCheck.password_hash,
      dto.password,
    );
    if (!passwordCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const token: string = await this.tokenService.generateJwtToken(
      userExistCheck.User_id,
    );
    return {
      email: userExistCheck.email,
      name: userExistCheck.name,
      token: token,
    };
  }

  async destroyUser(user_id: number): Promise<number> {
    return this.userRepository.destroy({
      where: { User_id: user_id },
    });
  }

  async sendPasswordResetLink(dto: RequestPasswordResetDto): Promise<string> {
    const userExistCheck = await this.findUserByEmail(dto.email);
    if (!userExistCheck) {
      throw new BadRequestException(ErrorLog.USER_NOT_EXIST);
    }
    const resetToken: string = await this.tokenService.generateJwtToken(
      userExistCheck.User_id,
    );
    const resetUrl: string = `https://myapp/reset-password?token=${resetToken}`;
    return resetUrl;
  }

  async resetPassword(dto: ResetPasswordDto, user_id: number) {
    dto.newPassword = await this.passwordHash(dto.newPassword);
    return await this.userRepository.update(
      { password_hash: dto.newPassword },
      {
        where: { User_id: user_id },
      },
    );
  }
}
