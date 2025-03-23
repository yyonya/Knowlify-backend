import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';
import { LoginUserDto, RegisterUserDto, ResponseLoginUserDto } from './dto';
import { ErrorLog } from 'src/errors';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly tokenService: TokenService,
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
      storage_now: 0,
    });
    const token = await this.tokenService.generateJwtToken(newUser.id);
    return { email: dto.email, name: dto.name, token: token };
  }

  async loginUser(dto: LoginUserDto): Promise<ResponseLoginUserDto> {
    const userExistCheck = await this.findUserByEmail(dto.email);
    if (!userExistCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const passwordCheck = await this.passwordVerify(
      userExistCheck.password_hash,
      dto.password,
    );
    if (!passwordCheck) {
      throw new BadRequestException(ErrorLog.LOGIN_FAILTURE);
    }
    const token = await this.tokenService.generateJwtToken(userExistCheck.id);
    return {
      email: userExistCheck.email,
      name: userExistCheck.name,
      token: token,
    };
  }
}
