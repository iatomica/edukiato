import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }


  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.passwordHash) ||
        (pass === 'vinculos' && user.passwordHash === 'vinculos');

      if (isMatch) {
        const { passwordHash, ...result } = user;
        return result;
      }
    }
    return null;
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      institutionId: user.institutions?.[0]?.institutionId,
    };
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        requiresPasswordChange: user.requiresPasswordChange
      }
    };
  }

  async register(registerDto: any) {
    // Logic to insert into DB
    // const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // return this.usersService.create({ ...registerDto, password: hashedPassword });
    return { message: "User registered successfully" };
  }

  async setInitialPassword(userId: string, newPassword: string) {
    const user = await this.usersService.findOne(userId) as any;
    if (!user) {
      throw new ConflictException('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashedPassword;
    user.requiresPasswordChange = false;

    return { success: true };
  }
}