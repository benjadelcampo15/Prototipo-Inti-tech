import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from 'src/dtos/user.dto';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(user: RegisterUserDto): Promise<Partial<User>> {
    const newUser = this.userService.createUser(user);

    if (!newUser) {
      throw new NotFoundException('User not created');
    }

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
