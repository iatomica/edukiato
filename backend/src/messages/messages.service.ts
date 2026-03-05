import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

type MessageRow = {
    id: string;
    institution_id: string;
    sender_id: string;
    recipient_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
    file_name?: string | null;
    file_url?: string | null;
    file_type?: string | null;
    file_size?: number | null;
};

@Injectable()
export class MessagesService {
    constructor(@Inject('DB_POOL') private readonly pool: Pool) {}

    async ensureTable(): Promise<void> {
        await this.pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id VARCHAR(80) PRIMARY KEY,
                institution_id VARCHAR(80) NOT NULL,
                sender_id VARCHAR(80) NOT NULL,
                recipient_id VARCHAR(80) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                is_read BOOLEAN DEFAULT FALSE,
                file_name VARCHAR(255),
                file_url TEXT,
                file_type VARCHAR(120),
                file_size INTEGER
            );
        `);

        await this.pool.query('CREATE INDEX IF NOT EXISTS idx_messages_institution ON messages (institution_id)');
        await this.pool.query('CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages (sender_id, recipient_id)');
        await this.pool.query('CREATE INDEX IF NOT EXISTS idx_messages_recipient_read ON messages (recipient_id, is_read)');
    }

    async getMessages(institutionId: string, currentUserId: string, targetUserId: string) {
        await this.ensureTable();

        const result = await this.pool.query<MessageRow>(
            `
            SELECT id, institution_id, sender_id, recipient_id, content, created_at, is_read, file_name, file_url, file_type, file_size
            FROM messages
            WHERE institution_id = $1
              AND (
                  (sender_id = $2 AND recipient_id = $3)
                  OR (sender_id = $3 AND recipient_id = $2)
              )
            ORDER BY created_at ASC
            `,
            [institutionId, currentUserId, targetUserId],
        );

        return result.rows.map((row) => ({
            id: row.id,
            senderId: row.sender_id,
            content: row.content,
            timestamp: row.created_at,
            isRead: row.is_read,
            file: row.file_url
                ? {
                      name: row.file_name || 'Adjunto',
                      url: row.file_url,
                      type: row.file_type || 'application/octet-stream',
                      size: row.file_size || 0,
                  }
                : undefined,
        }));
    }

    async sendMessage(
        institutionId: string,
        senderId: string,
        recipientId: string,
        content: string,
        file?: { name?: string; url?: string; type?: string; size?: number },
    ) {
        await this.ensureTable();

        const id = `msg_${randomUUID()}`;
        const result = await this.pool.query<MessageRow>(
            `
            INSERT INTO messages (id, institution_id, sender_id, recipient_id, content, created_at, is_read, file_name, file_url, file_type, file_size)
            VALUES ($1, $2, $3, $4, $5, NOW(), FALSE, $6, $7, $8, $9)
            RETURNING id, sender_id, content, created_at, is_read, file_name, file_url, file_type, file_size
            `,
            [
                id,
                institutionId,
                senderId,
                recipientId,
                content,
                file?.name || null,
                file?.url || null,
                file?.type || null,
                file?.size || null,
            ],
        );

        const row = result.rows[0];
        return {
            id: row.id,
            senderId: row.sender_id,
            content: row.content,
            timestamp: row.created_at,
            isRead: row.is_read,
            file: row.file_url
                ? {
                      name: row.file_name || 'Adjunto',
                      url: row.file_url,
                      type: row.file_type || 'application/octet-stream',
                      size: row.file_size || 0,
                  }
                : undefined,
        };
    }

    async getConversations(institutionId: string, currentUserId: string) {
        await this.ensureTable();

        const result = await this.pool.query(
            `
            WITH user_messages AS (
                SELECT
                    id,
                    sender_id,
                    recipient_id,
                    content,
                    created_at,
                    is_read,
                    CASE
                        WHEN sender_id = $2 THEN recipient_id
                        ELSE sender_id
                    END AS contact_id
                FROM messages
                WHERE institution_id = $1
                  AND (sender_id = $2 OR recipient_id = $2)
            ),
            ranked AS (
                SELECT
                    contact_id,
                    id,
                    sender_id,
                    content,
                    created_at,
                    ROW_NUMBER() OVER (PARTITION BY contact_id ORDER BY created_at DESC) AS rn
                FROM user_messages
            ),
            unread AS (
                SELECT
                    CASE
                        WHEN sender_id = $2 THEN recipient_id
                        ELSE sender_id
                    END AS contact_id,
                    COUNT(*)::int AS unread_count
                FROM messages
                WHERE institution_id = $1
                  AND recipient_id = $2
                  AND is_read = FALSE
                GROUP BY 1
            )
            SELECT
                r.contact_id,
                r.id AS message_id,
                r.sender_id,
                r.content,
                r.created_at,
                COALESCE(u.unread_count, 0) AS unread_count
            FROM ranked r
            LEFT JOIN unread u ON u.contact_id = r.contact_id
            WHERE r.rn = 1
            ORDER BY r.created_at DESC
            `,
            [institutionId, currentUserId],
        );

        return result.rows.map((row: any) => ({
            contactId: row.contact_id,
            lastMessage: {
                id: row.message_id,
                senderId: row.sender_id,
                content: row.content,
                timestamp: row.created_at,
                isRead: row.unread_count === 0,
            },
            unreadCount: row.unread_count,
        }));
    }

    async markAsRead(institutionId: string, currentUserId: string, targetUserId: string) {
        await this.ensureTable();

        await this.pool.query(
            `
            UPDATE messages
            SET is_read = TRUE
            WHERE institution_id = $1
              AND sender_id = $2
              AND recipient_id = $3
              AND is_read = FALSE
            `,
            [institutionId, targetUserId, currentUserId],
        );

        return { success: true };
    }
}
