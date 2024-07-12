import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { AuthRepository } from 'src/repositories/auth.repository';

@Controller()
export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}
  @Post('register')
  async registerEmailAndPassword(@Body() body): Promise<User> {
    return await this.authRepository.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; token: string }> {
    return await this.authRepository.login(body.email, body.password);
  }
}
