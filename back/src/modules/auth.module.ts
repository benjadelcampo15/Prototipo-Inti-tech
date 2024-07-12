import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "src/controllers/auth.controller";
import { User } from "src/entities/user.entity";
import { AuthRepository } from "src/repositories/auth.repository";
import { UserRepository } from "src/repositories/user.repository";
import { UserService } from "src/services/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [ AuthRepository , UserService , UserRepository],
    controllers: [AuthController],
  })

export class AuthModule {}