import { IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'src/enum/role.enum';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  phone: string;
  role: Role;
}
