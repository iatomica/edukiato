import { Inject, Injectable, OnModuleInit, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AcademicReport } from './entities/report.entity';
import { randomUUID } from 'crypto';
import { Pool } from 'pg';

@Injectable()
export class ReportsService implements OnModuleInit {
    constructor(@Inject('DB_POOL') private readonly dbPool: Pool) { }

    async onModuleInit() {
        await this.dbPool.query(`
            CREATE TABLE IF NOT EXISTS academic_reports (
                id VARCHAR(80) PRIMARY KEY,
                student_id VARCHAR(80) NOT NULL,
                uploader_id VARCHAR(80) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
    }

    async createReport(studentId: string, uploaderId: string, title: string, content: string): Promise<AcademicReport> {
        try {
            const newReport: AcademicReport = {
                id: randomUUID(),
                studentId,
                uploaderId,
                title,
                content,
                createdAt: new Date()
            };

            await this.dbPool.query(
                `
                INSERT INTO academic_reports (id, student_id, uploader_id, title, content, created_at)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [newReport.id, newReport.studentId, newReport.uploaderId, newReport.title, newReport.content, newReport.createdAt],
            );

            return newReport;
        } catch (error) {
            console.error('Error saving report metadata to PostgreSQL:', error);
            throw new InternalServerErrorException('Error saving report metadata');
        }
    }

    async getReportsByStudent(studentId: string): Promise<AcademicReport[]> {
        const rows = await this.dbPool.query(
            `
            SELECT id, student_id, uploader_id, title, content, created_at
            FROM academic_reports
            WHERE student_id = $1
            ORDER BY created_at DESC
            `,
            [studentId],
        );

        return rows.rows.map((row) => ({
            id: row.id,
            studentId: row.student_id,
            uploaderId: row.uploader_id,
            title: row.title,
            content: row.content,
            createdAt: row.created_at,
        }));
    }

    async getReportById(reportId: string): Promise<AcademicReport> {
        const rows = await this.dbPool.query(
            `
            SELECT id, student_id, uploader_id, title, content, created_at
            FROM academic_reports
            WHERE id = $1
            `,
            [reportId],
        );

        const reportRow = rows.rows[0];
        const report = reportRow ? {
            id: reportRow.id,
            studentId: reportRow.student_id,
            uploaderId: reportRow.uploader_id,
            title: reportRow.title,
            content: reportRow.content,
            createdAt: reportRow.created_at,
        } : null;

        if (!report) {
            throw new NotFoundException('Report not found');
        }
        return report;
    }
}
