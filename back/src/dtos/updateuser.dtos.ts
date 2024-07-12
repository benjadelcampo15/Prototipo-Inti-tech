/* eslint-disable prettier/prettier */

import { Role } from 'src/enum/role.enum';


export class UserDto {
    
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
}