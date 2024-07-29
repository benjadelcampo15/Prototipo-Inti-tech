import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { RegisterUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/enum/role.enum';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGUard } from 'src/guards/auth.guard';
import { AuthRepository } from 'src/repositories/auth.repository';

@Controller()
export class AuthController {
  constructor(private readonly authRepository: AuthRepository) {}
  @Post('register')
  @Roles(Role.Admin)
  @UseGuards(AuthGUard, AdminGuard)
  async registerEmailAndPassword(@Body() body: RegisterUserDto): Promise<User> {
    return await this.authRepository.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ): Promise<{ message: string; token: string }> {
    return await this.authRepository.login(body.email, body.password);
  }
}
