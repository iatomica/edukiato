import { Controller, Post, Get, Param, UseGuards, Req, Body, BadRequestException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post('student/:studentId')
    async createReport(
        @Param('studentId') studentId: string,
        @Body('title') title: string,
        @Body('content') content: string,
        @Req() req: any
    ) {
        if (!title || !content) {
            throw new BadRequestException('El título y contenido son obligatorios');
        }

        const uploaderId = req.user.userId;
        const report = await this.reportsService.createReport(studentId, uploaderId, title, content);
        return { message: 'Informe guardado exitosamente', report };
    }

    @Get('student/:studentId')
    async getReports(@Param('studentId') studentId: string) {
        const reports = await this.reportsService.getReportsByStudent(studentId);
        return reports;
    }
}
