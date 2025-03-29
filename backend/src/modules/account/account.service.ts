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
    const newPage = await this.workspaceService.createPage({
      parent_page_id: null,
      depth: 0,
      workspace_id: newWorkspace.Workspace_id,
    });
    // await newUser.$add('pages', newPage, {
    //   through: {
    //     role: 'owner',
    //   },
    // });
    await this.workspaceService.createWorkspaceMember({
      user_id: newUser.User_id,
      page_id: newPage.Page_id,
      role: 'owner',
    });
    const token: string = await this.userService.generateToken(newUser);
    return {
      email: dto.email,
      name: dto.name,
      token: token,
      workspace_name: newWorkspace.name,
      pages: [
        {
          page_id: newPage.Page_id,
          title: newPage.title,
          description: newPage.description,
          parent_page_id: newPage.parent_page_id,
          depth: newPage.depth,
          picture_url: newPage.picture_url,
          avatar_url: newPage.avatar_url,
          type: newPage.type,
          is_public: newPage.is_public,
          category: newPage.category,
          subscription_type: newPage.subscription_type,
          created_at: new Date(
            newPage.createdAt as unknown as string,
          ).toISOString(),
          updated_at: new Date(
            newPage.updatedAt as unknown as string,
          ).toISOString(),
        },
      ],
    };
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
    const userWorkspace = await this.workspaceService.findWorkspaceByUserId(
      userExistCheck.User_id,
    );
    if (!userWorkspace) {
      throw new BadRequestException(ErrorLog.WORKSPACE_NOT_EXIST);
    }
    const userPages = await this.workspaceService.getUserPagesByUserId(
      userExistCheck.User_id,
    );
    const token: string = await this.userService.generateToken(userExistCheck);
    return {
      email: userExistCheck.email,
      name: userExistCheck.name,
      token: token,
      workspace_name: userWorkspace.name,
      pages: userPages.map((page) => ({
        page_id: page.Page_id,
        title: page.title,
        description: page.description,
        parent_page_id: page.parent_page_id,
        depth: page.depth,
        picture_url: page.picture_url,
        avatar_url: page.avatar_url,
        type: page.type,
        is_public: page.is_public,
        category: page.category,
        subscription_type: page.subscription_type,
        created_at: new Date(page.createdAt as unknown as string).toISOString(),
        updated_at: new Date(page.updatedAt as unknown as string).toISOString(),
      })),
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
