import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as argon2 from 'argon2';
import { RegisterUserDto } from '../account/dto';

import { TokenService } from 'src/modules/token/token.service';

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

  async findUserById(User_id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { User_id: User_id } });
  }

  async createUser(dto: RegisterUserDto): Promise<User> {
    return this.userRepository.create({
      email: dto.email,
      name: dto.name,
      password_hash: dto.password,
      storage_limit: 2048,
      storage: 0,
    });
  }

  async generateToken(user: User): Promise<string> {
    return this.tokenService.generateJwtToken(user.User_id);
  }

  async deleteUser(user_id: number): Promise<number> {
    return this.userRepository.destroy({
      where: { User_id: user_id },
    });
  }

  async updateUserPassword(newPassword: string, user_id: number) {
    return this.userRepository.update(
      { password_hash: newPassword },
      {
        where: { User_id: user_id },
      },
    );
  }
}
