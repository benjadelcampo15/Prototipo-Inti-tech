/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/dtos/updateuser.dtos';
import { RegisterUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(page: number, limit: number): Promise<User[]> {
    return this.userRepository.getAllUsers(page, limit);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.getUserByEmail(email);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string): Promise<string> {
    return await this.userRepository.delete(id);
  }

  async createUser(user: RegisterUserDto): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
