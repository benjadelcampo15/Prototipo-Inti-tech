/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enum/role.enum';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dtos/updateuser.dtos';


Injectable()
export class UserRepository implements OnModuleInit {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    
  ) { }

  async onModuleInit(): Promise<void> {
    const user: User = await this.userRepository.findOne({
      where: { email: 'admin@example.com' },
    });
    if (!user) {
      const hashedPassword = await bcrypt.hash('Password1!', 10);
      const newUser = this.userRepository.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '123456789',
        role: Role.Admin,
      });
      await this.userRepository.save(newUser);
      
    }
  }

  async getAllUsers(page: number, limit: number): Promise<User[]> {
    const [users]: [User[], number] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    if (!users.length) {
      throw new NotFoundException(
        'Users not found, please create at least one',
      );
    }

    return users;
  }

  async getUserById(id: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id }});
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { email } });
    console.log(user);
    console.log(email);
    
    return user;
  }

  

  async updateUser(id: string, data: Partial<UserDto>): Promise<User> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }
  
    const updatedUser = this.userRepository.merge(user, data);
    await this.userRepository.save(updatedUser);
  
    return updatedUser;
  }

  async delete(id: string): Promise<string> {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return 'User deleted';
  }

  async createUser(user: UserDto): Promise<User> {
    const userExist: User = await this.userRepository.findOne({ where: { email: user.email } });
    if (userExist) {
      throw new BadRequestException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create({...user, password: hashedPassword });
    await this.userRepository.save(newUser);
    return newUser;
  }
}