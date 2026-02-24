import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import type { User, UserInstitution, UserRole } from '../types';

@Injectable()
export class UsersService {
    // Mock DB matching the MOCK_USERS from frontend api.ts
    private users: User[] = [
        {
            id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            name: 'Alex Rivera',
            email: 'admin@edukiato.edu',
            role: 'ADMIN_INSTITUCION',
            avatar: 'https://picsum.photos/seed/alex/200',
            institutions: [
                {
                    institutionId: 'inst-001',
                    institutionName: 'Instituto de Arte Contemporáneo',
                    institutionSlug: 'arte-contemporaneo',
                    role: 'ADMIN_INSTITUCION',
                    logoUrl: 'https://picsum.photos/seed/inst1/200',
                    primaryColor: '#7c3aed',
                    secondaryColor: '#5b21b6',
                },
            ],
        },
        {
            id: 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11',
            name: 'Elena Fisher',
            email: 'elena@edukiato.edu',
            role: 'DOCENTE',
            avatar: 'https://picsum.photos/seed/elena/200',
            institutions: [
                {
                    institutionId: 'inst-001',
                    institutionName: 'Instituto de Arte Contemporáneo',
                    institutionSlug: 'arte-contemporaneo',
                    role: 'DOCENTE',
                    logoUrl: 'https://picsum.photos/seed/inst1/200',
                    primaryColor: '#7c3aed',
                    secondaryColor: '#5b21b6',
                },
            ],
        },
        {
            id: 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11',
            name: 'Sofía Chen',
            email: 'sofia@student.com',
            role: 'ESTUDIANTE',
            avatar: 'https://picsum.photos/seed/sofia/200',
            institutions: [
                {
                    institutionId: 'inst-001',
                    institutionName: 'Instituto de Arte Contemporáneo',
                    institutionSlug: 'arte-contemporaneo',
                    role: 'ESTUDIANTE',
                    logoUrl: 'https://picsum.photos/seed/inst1/200',
                    primaryColor: '#7c3aed',
                    secondaryColor: '#5b21b6',
                },
            ],
        },
    ];

    findAll(institutionId?: string) {
        if (!institutionId) {
            return this.users;
        }
        // Filter users belonging to the specific institution
        return this.users.filter(user =>
            user.institutions?.some(inst => inst.institutionId === institutionId)
        );
    }

    findOne(id: string) {
        const user = this.users.find(u => u.id === id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    create(createUserDto: CreateUserDto, institutionId: string) {
        // Basic mock of user creation tied to an institution
        const newUser: User = {
            id: `usr_${crypto.randomUUID()}`,
            name: createUserDto.name,
            email: createUserDto.email,
            role: (createUserDto.role as UserRole) || 'ESTUDIANTE',
            avatar: createUserDto.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${createUserDto.name}`,
            institutions: [
                {
                    institutionId: institutionId,
                    institutionName: 'Current Institution', // Normally fetched from DB
                    institutionSlug: 'current-institution',
                    role: (createUserDto.role as UserRole) || 'ESTUDIANTE',
                }
            ]
        };

        this.users.push(newUser);
        return newUser;
    }
}
