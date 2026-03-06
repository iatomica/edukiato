import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import * as crypto from 'crypto';
import { Pool } from 'pg';

@Injectable()
export class InstitutionsService {
    constructor(@Inject('DB_POOL') private readonly dbPool: Pool) { }

    private async ensureTables(): Promise<void> {
        await this.dbPool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(80) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                role VARCHAR(50) NOT NULL,
                avatar VARCHAR(500),
                requires_password_change BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

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
            CREATE TABLE IF NOT EXISTS user_institutions (
                user_id VARCHAR(80) REFERENCES users(id) ON DELETE CASCADE,
                institution_id VARCHAR(80) REFERENCES institutions(id) ON DELETE CASCADE,
                role VARCHAR(50) NOT NULL,
                PRIMARY KEY(user_id, institution_id)
            );
        `);
    }

    async findAllForUser(userId: string) {
        await this.ensureTables();
        const rows = await this.dbPool.query(
            `
            SELECT 
                i.id, i.name, i.slug, i.logo_url, i.primary_color, i.secondary_color, 
                i.plan, i.is_active, i.created_at, i.updated_at, ui.role
            FROM institutions i
            INNER JOIN user_institutions ui ON i.id = ui.institution_id
            WHERE ui.user_id = $1
            ORDER BY i.created_at DESC
            `,
            [userId]
        );

        return rows.rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            logoUrl: row.logo_url,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
            plan: row.plan,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            role: row.role, // Include the user's role in this institution
        }));
    }

    async findAll() {
        await this.ensureTables();
        const rows = await this.dbPool.query(
            `
            SELECT id, name, slug, logo_url, primary_color, secondary_color, plan, is_active, created_at, updated_at
            FROM institutions
            ORDER BY created_at DESC
            `,
        );

        return rows.rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            logoUrl: row.logo_url,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
            plan: row.plan,
            isActive: row.is_active,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        }));
    }

    async findOne(id: string) {
        await this.ensureTables();
        const rows = await this.dbPool.query(
            `
            SELECT id, name, slug, logo_url, primary_color, secondary_color, plan, is_active, created_at, updated_at
            FROM institutions
            WHERE id = $1
            `,
            [id],
        );

        const institution = rows.rows[0];
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${id} not found`);
        }

        return {
            id: institution.id,
            name: institution.name,
            slug: institution.slug,
            logoUrl: institution.logo_url,
            primaryColor: institution.primary_color,
            secondaryColor: institution.secondary_color,
            plan: institution.plan,
            isActive: institution.is_active,
            createdAt: institution.created_at,
            updatedAt: institution.updated_at,
        };
    }

    async create(createDto: CreateInstitutionDto, userId: string) {
        await this.ensureTables();

        const newInst = {
            id: `inst_${crypto.randomUUID()}`,
            name: createDto.name,
            slug: createDto.slug,
            logoUrl: createDto.logoUrl || null,
            primaryColor: createDto.primaryColor || '#14b8a6',
            secondaryColor: createDto.secondaryColor || '#0f766e',
            plan: createDto.plan || 'FREE',
            isActive: true,
        };

        await this.dbPool.query(
            `
            INSERT INTO institutions (id, name, slug, logo_url, primary_color, secondary_color, plan, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, NOW(), NOW())
            `,
            [newInst.id, newInst.name, newInst.slug, newInst.logoUrl, newInst.primaryColor, newInst.secondaryColor, newInst.plan],
        );

        await this.dbPool.query(
            `
            INSERT INTO user_institutions (user_id, institution_id, role)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, institution_id) DO UPDATE SET role = EXCLUDED.role
            `,
            [userId, newInst.id, 'ADMIN_INSTITUCION'],
        );

        return this.findOne(newInst.id);
    }
}
