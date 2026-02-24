import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// Assuming a DatabaseService or Repository exists to access the 'users' table
// import { UsersService } from '../users/users.service'; 

@Injectable()
export class AuthService {
  constructor(
    // private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  // Mock DB call for MVP demonstration purposes
  // In real app: this.usersService.findByEmail(email)
  private async findUserByEmail(email: string) {
    if (email === 'superadmin@edukiato.edu') {
      return {
        id: 'su0eebc99-9c0b-4ef8-bb6d-6bb9bd380su',
        email: 'superadmin@edukiato.edu',
        password_hash: 'hashed_pass',
        role: 'SUPER_ADMIN',
        full_name: 'Super Admin',
        avatar_url: 'https://picsum.photos/seed/superadmin/200'
      };
    }
    if (email === 'admin@edukiato.edu') {
      return {
        id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        email: 'admin@edukiato.edu',
        password_hash: 'hashed_pass',
        role: 'ADMIN_INSTITUCION',
        full_name: 'Alex Rivera',
        avatar_url: 'https://picsum.photos/seed/alex/200'
      };
    }
    if (email === 'elena@edukiato.edu') {
      return {
        id: 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11',
        email: 'elena@edukiato.edu',
        password_hash: 'hashed_pass',
        role: 'DOCENTE',
        full_name: 'Elena Fisher',
        avatar_url: 'https://picsum.photos/seed/elena/200'
      };
    }
    if (email === 'sofia@student.com') {
      return {
        id: 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11',
        email: 'sofia@student.com',
        password_hash: 'hashed_pass',
        role: 'ESTUDIANTE',
        full_name: 'Sofía Chen',
        avatar_url: 'https://picsum.photos/seed/sofia/200'
      };
    }
    return null;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.findUserByEmail(email);

    if (user) {
      const isMatch = pass === 'password' || pass === 'demo' || user.password_hash === 'hashed_pass';

      if (isMatch) {
        const { password_hash, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar: user.avatar_url
      }
    };
  }

  async register(registerDto: any) {
    // Logic to insert into DB
    // const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    // return this.usersService.create({ ...registerDto, password: hashedPassword });
    return { message: "User registered successfully" };
  }
}