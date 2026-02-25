import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Pool } from 'pg';
import { CalendarEvent } from './entities/event.entity';

@Injectable()
export class EventsService {
    constructor(@Inject('DB_POOL') private readonly pool: Pool) { }

    async create(createEventDto: CreateEventDto, institutionId: string, creatorId: string): Promise<CalendarEvent> {
        try {
            const query = `
                INSERT INTO events (
                    institution_id, creator_id, title, description, start_time, end_time, 
                    type, color, shared_scope, shared_target_ids
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *;
            `;
            const values = [
                institutionId,
                creatorId,
                createEventDto.title,
                createEventDto.description || null,
                createEventDto.start,
                createEventDto.end,
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
        try {
            // Un estudiante/padre solo puede ver ALL o eventos dirigidos a sus cursos
            // Un Admin/Docente (dependiendo como llamemos) podria ver todos.
            // Para mantener simpleza, traemos todos los de la institucion. El filtro puede hacerse en Frontend o aca.

            const query = `
                SELECT * FROM events 
                WHERE institution_id = $1
            `;
            const result = await this.pool.query(query, [institutionId]);
            return result.rows.map(row => this.mapToEntity(row));
        } catch (error) {
            throw new InternalServerErrorException('Error fetching events');
        }
    }

    async findOne(id: string, institutionId: string): Promise<CalendarEvent> {
        const query = `SELECT * FROM events WHERE id = $1 AND institution_id = $2`;
        const result = await this.pool.query(query, [id, institutionId]);
        if (result.rows.length === 0) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return this.mapToEntity(result.rows[0]);
    }

    async update(id: string, updateEventDto: UpdateEventDto, institutionId: string): Promise<CalendarEvent> {
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
                values.push(updateEventDto.start);
            }
            if (updateEventDto.end) {
                updates.push(`end_time = $${index++}`);
                values.push(updateEventDto.end);
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
        return {
            id: row.id,
            institutionId: row.institution_id,
            title: row.title,
            description: row.description,
            start: row.start_time,
            end: row.end_time,
            type: row.type,
            color: row.color,
            creatorId: row.creator_id,
            sharedWith: {
                scope: row.shared_scope,
                targetIds: typeof row.shared_target_ids === 'string'
                    ? JSON.parse(row.shared_target_ids)
                    : row.shared_target_ids
            }
        };
    }
}
