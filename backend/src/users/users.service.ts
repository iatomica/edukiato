import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import type { User, UserInstitution, UserRole } from '../types';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
    constructor(@Inject('DB_POOL') private readonly dbPool: Pool) { }

    private async ensureTables(): Promise<void> {
        await this.dbPool.query(`
            CREATE TABLE IF NOT EXISTS institutions (
                id VARCHAR(80) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255),
                logo_url VARCHAR(500),
                primary_color VARCHAR(50),
                secondary_color VARCHAR(50),
                plan VARCHAR(30),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500)`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS primary_color VARCHAR(50)`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS secondary_color VARCHAR(50)`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS plan VARCHAR(30)`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`);
        await this.dbPool.query(`ALTER TABLE institutions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`);

        await this.dbPool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(80) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                role VARCHAR(50) NOT NULL,
                avatar VARCHAR(500),
                requires_password_change BOOLEAN DEFAULT FALSE,
                birth_date DATE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await this.dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`);
        await this.dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT FALSE`);
        await this.dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE`);
        await this.dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`);
        await this.dbPool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`);

        await this.dbPool.query(`
            CREATE TABLE IF NOT EXISTS user_institutions (
                user_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE,
                institution_id VARCHAR(80) REFERENCES institutions(id) ON DELETE CASCADE,
                role VARCHAR(50) NOT NULL,
                PRIMARY KEY(user_id, institution_id)
            );
        `);

        const countResult = await this.dbPool.query(`SELECT COUNT(*)::int AS total FROM users`);
        const totalUsers = countResult.rows[0]?.total || 0;

        if (totalUsers === 0) {
            await this.dbPool.query(
                `
                INSERT INTO institutions (id, name, slug, logo_url, primary_color, secondary_color, plan, is_active, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW(), NOW())
                ON CONFLICT (id) DO NOTHING
                `,
                ['inst-vinculos', 'Vínculos de Libertad', 'vinculos-de-libertad', null, '#0ea5e9', '#0369a1', 'PRO'],
            );

            await this.dbPool.query(
                `
                INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change, created_at, updated_at)
                VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW(), NOW())
                ON CONFLICT (id) DO NOTHING
                `,
                [
                    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                    'Admin Edukiato',
                    'admin@edukiato.edu',
                    'vinculos',
                    'ADMIN_INSTITUCION',
                    'https://ui-avatars.com/api/?name=Admin%20Edukiato&background=random',
                ],
            );

            await this.dbPool.query(
                `
                INSERT INTO user_institutions (user_id, institution_id, role)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, institution_id) DO NOTHING
                `,
                ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'inst-vinculos', 'ADMIN_INSTITUCION'],
            );
        }
    }

    private mapRowsToUsers(rows: any[]): User[] {
        const grouped = new Map<string, User>();

        rows.forEach((row) => {
            const existing = grouped.get(row.id);
            const institution: UserInstitution | null = row.institution_id ? {
                institutionId: row.institution_id,
                institutionName: row.institution_name,
                institutionSlug: row.institution_slug,
                role: row.institution_role,
                logoUrl: row.logo_url,
                primaryColor: row.primary_color,
                secondaryColor: row.secondary_color,
            } : null;

            if (!existing) {
                grouped.set(row.id, {
                    id: row.id,
                    name: row.name,
                    email: row.email,
                    role: row.role,
                    avatar: row.avatar,
                    passwordHash: row.password_hash,
                    requiresPasswordChange: row.requires_password_change,
                    birthDate: row.birth_date,
                    institutions: institution ? [institution] : [],
                });
                return;
            }

            if (institution) {
                existing.institutions = [...(existing.institutions || []), institution];
            }
        });

        return [...grouped.values()];
    }

    async findAll(institutionId?: string): Promise<User[]> {
        await this.ensureTables();

        const rows = await this.dbPool.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.password_hash,
                u.role,
                u.avatar,
                u.requires_password_change,
                ui.institution_id,
                i.name AS institution_name,
                i.slug AS institution_slug,
                ui.role AS institution_role,
                i.logo_url,
                i.primary_color,
                i.secondary_color
            FROM users u
            LEFT JOIN user_institutions ui ON ui.user_id = u.id
            LEFT JOIN institutions i ON i.id = ui.institution_id
            WHERE ($1::text IS NULL OR ui.institution_id = $1)
            ORDER BY u.name ASC
            `,
            [institutionId || null],
        );

        return this.mapRowsToUsers(rows.rows);
    }

    async findOne(id: string): Promise<User> {
        const users = await this.findByIdInternal(id);
        if (!users.length) {
            throw new NotFoundException('User not found');
        }
        return users[0];
    }

    async findByEmail(email: string): Promise<User | undefined> {
        await this.ensureTables();

        const rows = await this.dbPool.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.password_hash,
                u.role,
                u.avatar,
                u.requires_password_change,
                ui.institution_id,
                i.name AS institution_name,
                i.slug AS institution_slug,
                ui.role AS institution_role,
                i.logo_url,
                i.primary_color,
                i.secondary_color
            FROM users u
            LEFT JOIN user_institutions ui ON ui.user_id = u.id
            LEFT JOIN institutions i ON i.id = ui.institution_id
            WHERE LOWER(u.email) = LOWER($1)
            ORDER BY u.name ASC
            `,
            [email],
        );

        return this.mapRowsToUsers(rows.rows)[0];
    }

    async create(createUserDto: CreateUserDto, institutionId: string, currentUserRole?: string): Promise<User> {
        await this.ensureTables();

        if (createUserDto.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SuperAdmins can create other SuperAdmins.');
        }

        const newId = `usr_${crypto.randomUUID()}`;
        const role = (createUserDto.role as UserRole) || 'ESTUDIANTE';
        const avatar = createUserDto.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${createUserDto.name}`;

        await this.dbPool.query(
            `
            INSERT INTO institutions (id, name, slug, logo_url, primary_color, secondary_color, plan, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, NULL, $4, $5, 'PRO', TRUE, NOW(), NOW())
            ON CONFLICT (id) DO NOTHING
            `,
            [institutionId, 'Institución', institutionId, '#14b8a6', '#0f766e'],
        );

        await this.dbPool.query(
            `
            INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            `,
            [newId, createUserDto.name, createUserDto.email, 'vinculos', role, avatar, true],
        );

        await this.dbPool.query(
            `
            INSERT INTO user_institutions (user_id, institution_id, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, institution_id) DO UPDATE SET role = EXCLUDED.role
            `,
            [newId, institutionId, role],
        );

        return this.findOne(newId);
    }

    async update(id: string, updateData: Partial<CreateUserDto>, currentUserRole?: string): Promise<User> {
        await this.ensureTables();

        const existing = await this.findOne(id);

        if (existing.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SuperAdmins can edit other SuperAdmins.');
        }

        if (updateData.role === 'SUPER_ADMIN' && existing.role !== 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SuperAdmins can promote a user to SuperAdmin.');
        }

        const updatedName = updateData.name ?? existing.name;
        const updatedEmail = updateData.email ?? existing.email;
        const updatedAvatar = updateData.avatar ?? existing.avatar;
        const updatedRole = (updateData.role as UserRole) ?? existing.role;

        await this.dbPool.query(
            `
            UPDATE users
            SET name = $1,
                email = $2,
                avatar = $3,
                role = $4,
                updated_at = NOW()
            WHERE id = $5
            `,
            [updatedName, updatedEmail, updatedAvatar, updatedRole, id],
        );

        await this.dbPool.query(
            `
            UPDATE user_institutions
            SET role = $1
            WHERE user_id = $2
            `,
            [updatedRole, id],
        );

        return this.findOne(id);
    }

    async updatePassword(id: string, passwordHash: string): Promise<void> {
        await this.ensureTables();
        await this.dbPool.query(
            `
            UPDATE users
            SET password_hash = $1,
                requires_password_change = FALSE,
                updated_at = NOW()
            WHERE id = $2
            `,
            [passwordHash, id],
        );
    }

    async resetPassword(id: string, currentUserRole?: string): Promise<{ success: boolean; message: string }> {
        const user = await this.findOne(id);

        if (user.role === 'SUPER_ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SuperAdmins can reset passwords for other SuperAdmins.');
        }

        await this.dbPool.query(
            `
            UPDATE users
            SET requires_password_change = TRUE,
                password_hash = 'vinculos',
                updated_at = NOW()
            WHERE id = $1
            `,
            [id],
        );

        return {
            success: true,
            message: `Contraseña de ${user.name} restablecida a "vinculos". Deberá cambiarla en su próximo ingreso.`
        };
    }

    private async findByIdInternal(id: string): Promise<User[]> {
        await this.ensureTables();

        const rows = await this.dbPool.query(
            `
            SELECT
                u.id,
                u.name,
                u.email,
                u.password_hash,
                u.role,
                u.avatar,
                u.requires_password_change,
                ui.institution_id,
                i.name AS institution_name,
                i.slug AS institution_slug,
                ui.role AS institution_role,
                i.logo_url,
                i.primary_color,
                i.secondary_color
            FROM users u
            LEFT JOIN user_institutions ui ON ui.user_id = u.id
            LEFT JOIN institutions i ON i.id = ui.institution_id
            WHERE u.id = $1
            `,
            [id],
        );

        return this.mapRowsToUsers(rows.rows);
    }
}
