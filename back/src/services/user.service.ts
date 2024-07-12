import { Injectable } from '@nestjs/common';
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

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string): Promise<string> {
    return await this.userRepository.delete(id);
  }
}
