import { Injectable } from '@nestjs/common';
import { users } from '../test_data';

@Injectable()
export class UsersService {
  getUsers() {
    return users;
  }
}
