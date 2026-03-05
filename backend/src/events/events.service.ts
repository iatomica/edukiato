import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Pool } from 'pg';
import { CalendarEvent } from './entities/event.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
    constructor(@Inject('DB_POOL') private readonly pool: Pool) { }

    private toLocalTimestampValue(input: string | Date): string {
        const parsed = new Date(input);
        if (Number.isNaN(parsed.getTime())) {
            throw new InternalServerErrorException('Invalid event datetime payload');
        }

        const yyyy = parsed.getFullYear();
        const mm = String(parsed.getMonth() + 1).padStart(2, '0');
        const dd = String(parsed.getDate()).padStart(2, '0');
        const hh = String(parsed.getHours()).padStart(2, '0');
        const mi = String(parsed.getMinutes()).padStart(2, '0');
        const ss = String(parsed.getSeconds()).padStart(2, '0');

        // Local timestamp without timezone to match TIMESTAMP columns semantics.
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }

    private async ensureSchema(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id VARCHAR(80) PRIMARY KEY,
                institution_id VARCHAR(80) NOT NULL,
                title VARCHAR(255) NOT NULL,
                start_time TIMESTAMP,
                end_time TIMESTAMP,
                type VARCHAR(80),
                color VARCHAR(120),
                creator_id VARCHAR(80),
                description TEXT,
                shared_scope VARCHAR(30),
                shared_target_ids TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS start_time TIMESTAMP`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TIMESTAMP`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS shared_scope VARCHAR(30)`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS shared_target_ids TEXT`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`);

        // Legacy compatibility columns used in old dumps
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS start_date TIMESTAMP`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS end_date TIMESTAMP`);
        await this.pool.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS shared_with_scope VARCHAR(30)`);
    }

    async create(createEventDto: CreateEventDto, institutionId: string, creatorId: string): Promise<CalendarEvent> {
        await this.ensureSchema();

        try {
            const eventId = `evt_${randomUUID()}`;
            const query = `
                INSERT INTO events (
                    id, institution_id, creator_id, title, description, start_time, end_time,
                    start_date, end_date, type, color, shared_scope, shared_with_scope, shared_target_ids, created_at, updated_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $6, $7, $8, $9, $10, $10, $11, NOW(), NOW())
                RETURNING *;
            `;
            const values = [
                eventId,
                institutionId,
                creatorId,
                createEventDto.title,
                createEventDto.description || null,
                this.toLocalTimestampValue(createEventDto.start),
                this.toLocalTimestampValue(createEventDto.end),
                createEventDto.type || 'event',
                createEventDto.color || 'bg-emerald-100 text-emerald-700 border-emerald-200',
                createEventDto.sharedWith?.scope || 'ALL',
                JSON.stringify(createEventDto.sharedWith?.targetIds || [])
            ];

            const result = await this.pool.query(query, values);
            return this.mapToEntity(result.rows[0]);
        } catch (error) {
            throw new InternalServerErrorException('Error creating event');
        }
    }

    async findAll(institutionId: string, courseIds: string[] = []): Promise<CalendarEvent[]> {
        await this.ensureSchema();

        try {
            // Un estudiante/padre solo puede ver ALL o eventos dirigidos a sus cursos
            // Un Admin/Docente (dependiendo como llamemos) podria ver todos.
            // Para mantener simpleza, traemos todos los de la institucion. El filtro puede hacerse en Frontend o aca.

            const query = `
                SELECT * FROM events 
                WHERE institution_id = $1
                ORDER BY COALESCE(start_time, start_date) ASC, created_at DESC
            `;
            const result = await this.pool.query(query, [institutionId]);
            return result.rows.map(row => this.mapToEntity(row));
        } catch (error) {
            throw new InternalServerErrorException('Error fetching events');
        }
    }

    async findOne(id: string, institutionId: string): Promise<CalendarEvent> {
        await this.ensureSchema();

        const query = `SELECT * FROM events WHERE id = $1 AND institution_id = $2`;
        const result = await this.pool.query(query, [id, institutionId]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return this.mapToEntity(result.rows[0]);
    }

    async update(id: string, updateEventDto: UpdateEventDto, institutionId: string): Promise<CalendarEvent> {
        await this.ensureSchema();

        // First check existence
        await this.findOne(id, institutionId);

        try {
            const updates = [];
            const values: any[] = [];
            let index = 1;

            if (updateEventDto.title) {
                updates.push(`title = $${index++}`);
                values.push(updateEventDto.title);
            }
            if (updateEventDto.description !== undefined) {
                updates.push(`description = $${index++}`);
                values.push(updateEventDto.description);
            }
            if (updateEventDto.start) {
                updates.push(`start_time = $${index++}`);
                values.push(this.toLocalTimestampValue(updateEventDto.start));
                updates.push(`start_date = $${index++}`);
                values.push(this.toLocalTimestampValue(updateEventDto.start));
            }
            if (updateEventDto.end) {
                updates.push(`end_time = $${index++}`);
                values.push(this.toLocalTimestampValue(updateEventDto.end));
                updates.push(`end_date = $${index++}`);
                values.push(this.toLocalTimestampValue(updateEventDto.end));
            }
            if (updateEventDto.type) {
                updates.push(`type = $${index++}`);
                values.push(updateEventDto.type);
            }
            if (updateEventDto.color) {
                updates.push(`color = $${index++}`);
                values.push(updateEventDto.color);
            }
            if (updateEventDto.sharedWith) {
                updates.push(`shared_scope = $${index++}`);
                values.push(updateEventDto.sharedWith.scope);
                updates.push(`shared_with_scope = $${index++}`);
                values.push(updateEventDto.sharedWith.scope);
                updates.push(`shared_target_ids = $${index++}`);
                values.push(JSON.stringify(updateEventDto.sharedWith.targetIds || []));
            }

            updates.push(`updated_at = CURRENT_TIMESTAMP`);

            const query = `
                UPDATE events 
                SET ${updates.join(', ')} 
                WHERE id = $${index++} AND institution_id = $${index}
                RETURNING *;
            `;

            values.push(id, institutionId);

            const result = await this.pool.query(query, values);
            return this.mapToEntity(result.rows[0]);
        } catch (error) {
            throw new InternalServerErrorException('Error updating event');
        }
    }

    async remove(id: string, institutionId: string): Promise<void> {
        await this.ensureSchema();

        // First check existence
        await this.findOne(id, institutionId);

        try {
            const query = `DELETE FROM events WHERE id = $1 AND institution_id = $2`;
            await this.pool.query(query, [id, institutionId]);
        } catch (error) {
            throw new InternalServerErrorException('Error deleting event');
        }
    }

    private mapToEntity(row: any): CalendarEvent {
        const sharedScope = row.shared_scope ?? row.shared_with_scope ?? 'ALL';
        const rawTargetIds = row.shared_target_ids ?? [];
        let parsedTargetIds: string[] = [];

        if (typeof rawTargetIds === 'string') {
            try {
                parsedTargetIds = JSON.parse(rawTargetIds);
            } catch {
                parsedTargetIds = [];
            }
        } else if (Array.isArray(rawTargetIds)) {
            parsedTargetIds = rawTargetIds;
        }

        return {
            id: row.id,
            institutionId: row.institution_id,
            title: row.title,
            description: row.description,
            start: row.start_time ?? row.start_date,
            end: row.end_time ?? row.end_date,
            type: row.type,
            color: row.color,
            creatorId: row.creator_id,
            sharedWith: {
                scope: sharedScope,
                targetIds: parsedTargetIds,
            }
        };
    }
}
