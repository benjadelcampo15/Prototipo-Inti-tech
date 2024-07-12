import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from 'src/dtos/updateuser.dtos';
import { UserService } from 'src/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(user: UserDto): Promise<User> {
    const newUser = this.userService.createUser(user);

    return newUser;
  }

  async createJwtToken(user: any): Promise<string> {
    const payload: any = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  }
  async login(
    email: string,
    password: string,
  ): Promise<{ message: string; token: string }> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      console.log(email);

      throw new NotFoundException('invalid email');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new NotFoundException('invalid email or password');
    }

    const token: string = await this.createJwtToken(user);
    return {
      message: 'Login successful',
      token,
    };
  }
}
