import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';

type CommunicationRow = {
    id: string;
    institution_id: string;
    type: string;
    title: string;
    content: string;
    sender_id: string;
    sender_name: string;
    recipient_id?: string | null;
    course_id?: string | null;
    created_at: string;
    is_read: boolean;
    read_by?: string[];
};

type AulaRow = {
    id: string;
    institution_id: string;
    name: string;
    capacity: number;
    color: string | null;
    teachers: string[];
    assistants: string[];
};

type NinoRow = {
    id: string;
    institution_id: string;
    name: string;
    gender: 'MASCULINO' | 'FEMENINO' | null;
    birth_date: string | null;
    allergies: string[] | null;
    avatar: string | null;
    aula_id: string | null;
    attendance_rate: number | null;
    parent_ids: string[];
};

@Injectable()
export class TenantDataService {
    constructor(@Inject('DB_POOL') private readonly pool: Pool) { }

    private async ensureAulasSchema(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS aulas (
                id VARCHAR(80) PRIMARY KEY,
                institution_id VARCHAR(80) NOT NULL,
                name VARCHAR(255) NOT NULL,
                capacity INTEGER DEFAULT 25,
                color VARCHAR(255)
            );
        `);

        await this.pool.query('ALTER TABLE aulas ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 25');
        await this.pool.query('ALTER TABLE aulas ADD COLUMN IF NOT EXISTS color VARCHAR(255)');

        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS aula_teachers (
                aula_id VARCHAR(80) NOT NULL,
                teacher_id VARCHAR(80) NOT NULL,
                type VARCHAR(30) NOT NULL DEFAULT 'DOCENTE',
                PRIMARY KEY (aula_id, teacher_id, type)
            );
        `);

        await this.pool.query('ALTER TABLE aula_teachers ADD COLUMN IF NOT EXISTS type VARCHAR(30) NOT NULL DEFAULT \'DOCENTE\'');
    }

    private async ensureStudentsSchema(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id VARCHAR(80) PRIMARY KEY,
                institution_id VARCHAR(80) NOT NULL,
                name VARCHAR(255) NOT NULL,
                gender VARCHAR(20),
                birth_date DATE,
                allergies TEXT[] DEFAULT '{}',
                avatar TEXT,
                aula_id VARCHAR(80),
                attendance_rate INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS gender VARCHAR(20)');
        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS birth_date DATE');
        await this.pool.query("ALTER TABLE students ADD COLUMN IF NOT EXISTS allergies TEXT[] DEFAULT '{}'");
        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS avatar TEXT');
        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS aula_id VARCHAR(80)');
        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS attendance_rate INTEGER DEFAULT 100');
        await this.pool.query('ALTER TABLE students ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');

        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS student_parents (
                student_id VARCHAR(80) NOT NULL,
                parent_id VARCHAR(80) NOT NULL,
                PRIMARY KEY (student_id, parent_id)
            );
        `);
    }

    private mapNinoRow(row: NinoRow) {
        return {
            id: row.id,
            institutionId: row.institution_id,
            name: row.name,
            gender: row.gender ?? undefined,
            birthDate: row.birth_date ?? undefined,
            allergies: row.allergies ?? [],
            avatar: row.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=random`,
            aulaId: row.aula_id ?? '',
            parentIds: row.parent_ids ?? [],
            attendanceRate: row.attendance_rate ?? undefined,
        };
    }

    private async ensureCommunicationsSchema(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS communications (
                id VARCHAR(80) PRIMARY KEY,
                institution_id VARCHAR(80) NOT NULL,
                type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                sender_id VARCHAR(80) NOT NULL,
                sender_name VARCHAR(255) NOT NULL,
                recipient_id VARCHAR(80),
                course_id VARCHAR(80),
                created_at TIMESTAMP DEFAULT NOW(),
                is_read BOOLEAN DEFAULT FALSE,
                read_by TEXT[] DEFAULT '{}'
            );
        `);

        await this.pool.query('ALTER TABLE communications ADD COLUMN IF NOT EXISTS recipient_id VARCHAR(80)');
        await this.pool.query('ALTER TABLE communications ADD COLUMN IF NOT EXISTS course_id VARCHAR(80)');
        await this.pool.query('ALTER TABLE communications ADD COLUMN IF NOT EXISTS read_by TEXT[] DEFAULT ARRAY[]::TEXT[]');
    }

    async getCommunications(institutionId: string, userId: string) {
        await this.ensureCommunicationsSchema();

        const query = `
            SELECT
                id,
                institution_id,
                type,
                title,
                content,
                sender_id,
                sender_name,
                recipient_id,
                course_id,
                created_at,
                is_read,
                read_by
            FROM communications
            WHERE institution_id = $1
            ORDER BY created_at DESC;
        `;

        const result = await this.pool.query<CommunicationRow>(query, [institutionId]);
        return result.rows.map((row) => ({
            id: row.id,
            institutionId: row.institution_id,
            type: row.type,
            title: row.title,
            content: row.content,
            senderId: row.sender_id,
            senderName: row.sender_name,
            recipientId: row.recipient_id ?? undefined,
            courseId: row.course_id ?? undefined,
            createdAt: row.created_at,
            isRead: row.read_by ? row.read_by.includes(userId) : false,
            attachments: [],
        }));
    }

    async markCommunicationsAsRead(institutionId: string, userId: string) {
        await this.ensureCommunicationsSchema();

        await this.pool.query(
            `
            UPDATE communications
            SET read_by = array_append(read_by, $2)
            WHERE institution_id = $1
              AND ($2 = ANY(read_by)) IS NOT TRUE
            `,
            [institutionId, userId]
        );

        return { success: true };
    }

    async createCommunication(
        institutionId: string,
        senderId: string,
        senderName: string,
        payload: { type: string; title: string; content: string; recipientId?: string | null; courseId?: string | null },
    ) {
        await this.ensureCommunicationsSchema();

        const id = `comm_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const result = await this.pool.query<CommunicationRow>(
            `
            INSERT INTO communications (
                id, institution_id, type, title, content, sender_id, sender_name, recipient_id, course_id, created_at, is_read
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), FALSE)
            RETURNING id, institution_id, type, title, content, sender_id, sender_name, recipient_id, course_id, created_at, is_read
            `,
            [
                id,
                institutionId,
                payload.type,
                payload.title,
                payload.content,
                senderId,
                senderName,
                payload.recipientId || null,
                payload.courseId || null,
            ],
        );

        const row = result.rows[0];
        return {
            id: row.id,
            institutionId: row.institution_id,
            type: row.type,
            title: row.title,
            content: row.content,
            senderId: row.sender_id,
            senderName: row.sender_name,
            recipientId: row.recipient_id ?? undefined,
            courseId: row.course_id ?? undefined,
            createdAt: row.created_at,
            isRead: row.is_read,
            attachments: [],
        };
    }

    async getAulas(institutionId: string) {
        await this.ensureAulasSchema();

        const query = `
            SELECT
                a.id,
                a.institution_id,
                a.name,
                a.capacity,
                a.color,
                COALESCE(array_remove(array_agg(CASE
                    WHEN at.type IS NULL OR at.type IN ('DOCENTE', 'TEACHER') THEN at.teacher_id
                    ELSE NULL
                END), NULL), '{}') AS teachers,
                COALESCE(array_remove(array_agg(CASE
                    WHEN at.type IN ('ASISTENTE', 'ASSISTANT') THEN at.teacher_id
                    ELSE NULL
                END), NULL), '{}') AS assistants
            FROM aulas a
            LEFT JOIN aula_teachers at ON at.aula_id = a.id
            WHERE a.institution_id = $1
            GROUP BY a.id, a.institution_id, a.name, a.capacity, a.color
            ORDER BY a.name ASC;
        `;

        const result = await this.pool.query<AulaRow>(query, [institutionId]);
        return result.rows.map((row) => ({
            id: row.id,
            institutionId: row.institution_id,
            name: row.name,
            capacity: row.capacity ?? 0,
            teachers: row.teachers ?? [],
            assistants: row.assistants ?? [],
            color: row.color ?? undefined,
        }));
    }

    async createAula(
        institutionId: string,
        payload: {
            name: string;
            color?: string;
            capacity?: number;
            teachers?: string[];
        },
    ) {
        await this.ensureAulasSchema();

        const id = `aula_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        await this.pool.query(
            `
            INSERT INTO aulas (id, institution_id, name, capacity, color)
            VALUES ($1, $2, $3, $4, $5)
            `,
            [id, institutionId, payload.name, payload.capacity ?? 25, payload.color ?? null],
        );

        if ((payload.teachers ?? []).length > 0) {
            const values: string[] = [];
            const params: unknown[] = [];

            payload.teachers.forEach((teacherId, index) => {
                const start = index * 3;
                values.push(`($${start + 1}, $${start + 2}, $${start + 3})`);
                params.push(id, teacherId, 'DOCENTE');
            });

            await this.pool.query(
                `INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ${values.join(', ')}`,
                params,
            );
        }

        const [created] = await this.getAulas(institutionId).then((aulas) => aulas.filter((a) => a.id === id));
        return created;
    }

    async updateAula(
        institutionId: string,
        aulaId: string,
        payload: {
            name?: string;
            color?: string;
            capacity?: number;
            teachers?: string[];
        },
    ) {
        await this.ensureAulasSchema();

        await this.pool.query(
            `
            UPDATE aulas
            SET
                name = COALESCE($1, name),
                color = COALESCE($2, color),
                capacity = COALESCE($3, capacity)
            WHERE id = $4 AND institution_id = $5
            `,
            [payload.name ?? null, payload.color ?? null, payload.capacity ?? null, aulaId, institutionId],
        );

        if (payload.teachers) {
            await this.pool.query(
                `DELETE FROM aula_teachers WHERE aula_id = $1 AND type IN ('DOCENTE', 'TEACHER')`,
                [aulaId],
            );

            if (payload.teachers.length > 0) {
                const values: string[] = [];
                const params: unknown[] = [];

                payload.teachers.forEach((teacherId, index) => {
                    const start = index * 3;
                    values.push(`($${start + 1}, $${start + 2}, $${start + 3})`);
                    params.push(aulaId, teacherId, 'DOCENTE');
                });

                await this.pool.query(
                    `INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ${values.join(', ')}`,
                    params,
                );
            }
        }

        const [updated] = await this.getAulas(institutionId).then((aulas) => aulas.filter((a) => a.id === aulaId));
        return updated;
    }

    async deleteAula(institutionId: string, aulaId: string) {
        await this.ensureAulasSchema();
        await this.ensureStudentsSchema();

        await this.pool.query('DELETE FROM aula_teachers WHERE aula_id = $1', [aulaId]);
        await this.pool.query('UPDATE students SET aula_id = NULL WHERE institution_id = $1 AND aula_id = $2', [institutionId, aulaId]);
        await this.pool.query('DELETE FROM aulas WHERE id = $1 AND institution_id = $2', [aulaId, institutionId]);

        return { success: true };
    }

    async getNinos(institutionId: string) {
        await this.ensureStudentsSchema();

        const query = `
            SELECT
                s.id,
                s.institution_id,
                s.name,
                s.gender,
                s.birth_date,
                s.allergies,
                s.avatar,
                s.aula_id,
                s.attendance_rate,
                COALESCE(array_remove(array_agg(sp.parent_id), NULL), '{}') AS parent_ids
            FROM students s
            LEFT JOIN student_parents sp ON sp.student_id = s.id
            WHERE s.institution_id = $1
            GROUP BY s.id, s.institution_id, s.name, s.gender, s.birth_date, s.allergies, s.avatar, s.aula_id, s.attendance_rate
            ORDER BY s.name ASC;
        `;

        const result = await this.pool.query<NinoRow>(query, [institutionId]);
        return result.rows.map((row) => this.mapNinoRow(row));
    }

    async createNino(
        institutionId: string,
        payload: {
            name: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId: string;
            parentIds: string[];
            attendanceRate?: number;
        },
    ) {
        await this.ensureStudentsSchema();

        const id = `nino_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

        await this.pool.query(
            `
            INSERT INTO students (
                id,
                institution_id,
                name,
                gender,
                birth_date,
                allergies,
                avatar,
                aula_id,
                attendance_rate,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6::text[], $7, $8, $9, NOW())
            `,
            [
                id,
                institutionId,
                payload.name,
                payload.gender ?? null,
                payload.birthDate ?? null,
                payload.allergies ?? [],
                payload.avatar ?? null,
                payload.aulaId,
                payload.attendanceRate ?? 100,
            ],
        );

        if ((payload.parentIds ?? []).length > 0) {
            const insertParentValues: string[] = [];
            const insertParams: unknown[] = [];
            payload.parentIds.forEach((parentId, index) => {
                const start = index * 2;
                insertParentValues.push(`($${start + 1}, $${start + 2})`);
                insertParams.push(id, parentId);
            });

            await this.pool.query(
                `INSERT INTO student_parents (student_id, parent_id) VALUES ${insertParentValues.join(', ')}`,
                insertParams,
            );
        }

        const createdResult = await this.pool.query<NinoRow>(
            `
            SELECT
                s.id,
                s.institution_id,
                s.name,
                s.gender,
                s.birth_date,
                s.allergies,
                s.avatar,
                s.aula_id,
                s.attendance_rate,
                COALESCE(array_remove(array_agg(sp.parent_id), NULL), '{}') AS parent_ids
            FROM students s
            LEFT JOIN student_parents sp ON sp.student_id = s.id
            WHERE s.id = $1
            GROUP BY s.id, s.institution_id, s.name, s.gender, s.birth_date, s.allergies, s.avatar, s.aula_id, s.attendance_rate
            `,
            [id],
        );

        return this.mapNinoRow(createdResult.rows[0]);
    }

    async updateNino(
        institutionId: string,
        ninoId: string,
        payload: {
            name?: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId?: string;
            parentIds?: string[];
            attendanceRate?: number;
        },
    ) {
        await this.ensureStudentsSchema();

        await this.pool.query(
            `
            UPDATE students
            SET
                name = COALESCE($1, name),
                gender = COALESCE($2, gender),
                birth_date = COALESCE($3, birth_date),
                allergies = COALESCE($4::text[], allergies),
                avatar = COALESCE($5, avatar),
                aula_id = COALESCE($6, aula_id),
                attendance_rate = COALESCE($7, attendance_rate),
                updated_at = NOW()
            WHERE id = $8 AND institution_id = $9
            `,
            [
                payload.name ?? null,
                payload.gender ?? null,
                payload.birthDate ?? null,
                payload.allergies ?? null,
                payload.avatar ?? null,
                payload.aulaId ?? null,
                payload.attendanceRate ?? null,
                ninoId,
                institutionId,
            ],
        );

        if (payload.parentIds) {
            await this.pool.query('DELETE FROM student_parents WHERE student_id = $1', [ninoId]);

            if (payload.parentIds.length > 0) {
                const insertParentValues: string[] = [];
                const insertParams: unknown[] = [];
                payload.parentIds.forEach((parentId, index) => {
                    const start = index * 2;
                    insertParentValues.push(`($${start + 1}, $${start + 2})`);
                    insertParams.push(ninoId, parentId);
                });

                await this.pool.query(
                    `INSERT INTO student_parents (student_id, parent_id) VALUES ${insertParentValues.join(', ')}`,
                    insertParams,
                );
            }
        }

        const updatedResult = await this.pool.query<NinoRow>(
            `
            SELECT
                s.id,
                s.institution_id,
                s.name,
                s.gender,
                s.birth_date,
                s.allergies,
                s.avatar,
                s.aula_id,
                s.attendance_rate,
                COALESCE(array_remove(array_agg(sp.parent_id), NULL), '{}') AS parent_ids
            FROM students s
            LEFT JOIN student_parents sp ON sp.student_id = s.id
            WHERE s.id = $1 AND s.institution_id = $2
            GROUP BY s.id, s.institution_id, s.name, s.gender, s.birth_date, s.allergies, s.avatar, s.aula_id, s.attendance_rate
            `,
            [ninoId, institutionId],
        );

        return this.mapNinoRow(updatedResult.rows[0]);
    }
}
