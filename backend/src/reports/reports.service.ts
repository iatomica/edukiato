import { Injectable, OnModuleInit, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AcademicReport } from './entities/report.entity';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class ReportsService implements OnModuleInit {
    // For local dev without Postgres running, we fall back to a JSON file
    private readonly dbFile = path.join(process.cwd(), 'data', 'reports_db.json');
    private reports: AcademicReport[] = [];

    async onModuleInit() {
        // Ensure data directory exists
        const dataDir = path.dirname(this.dbFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Load existing data if any
        if (fs.existsSync(this.dbFile)) {
            try {
                const data = fs.readFileSync(this.dbFile, 'utf8');
                this.reports = JSON.parse(data);
            } catch (error) {
                console.error('Error reading reports_db.json fallback database:', error);
                this.reports = [];
            }
        } else {
            // Create empty file
            this.saveDb();
        }
    }

    private saveDb() {
        try {
            fs.writeFileSync(this.dbFile, JSON.stringify(this.reports, null, 2));
        } catch (error) {
            console.error('Error writing to reports_db.json:', error);
        }
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

            this.reports.push(newReport);
            this.saveDb();

            return newReport;
        } catch (error) {
            console.error('Error saving report metadata to JSON fallback:', error);
            throw new InternalServerErrorException('Error saving report metadata');
        }
    }

    async getReportsByStudent(studentId: string): Promise<AcademicReport[]> {
        // Sort by newest first
        return this.reports
            .filter(r => r.studentId === studentId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    async getReportById(reportId: string): Promise<AcademicReport> {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        return report;
    }
}
