import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantDataService } from './tenant-data.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class TenantDataController {
    constructor(private readonly tenantDataService: TenantDataService) { }

    private resolveInstitutionId(req: any, queryInstitutionId?: string): string {
        const institutionId = req.user?.institutionId || queryInstitutionId;
        if (!institutionId) {
            throw new BadRequestException('institutionId is required');
        }
        return institutionId;
    }

    @Get('communications')
    async getCommunications(@Req() req: any, @Query('institutionId') institutionId?: string) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        const userId = req.user?.userId || req.user?.id || req.user?.sub;
        return this.tenantDataService.getCommunications(resolvedInstitutionId, userId);
    }

    @Put('communications/read')
    async markCommunicationsAsRead(@Req() req: any, @Query('institutionId') institutionId?: string) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        const userId = req.user?.userId || req.user?.id || req.user?.sub;
        return this.tenantDataService.markCommunicationsAsRead(resolvedInstitutionId, userId);
    }

    @Post('communications')
    async createCommunication(
        @Req() req: any,
        @Body() body: { type: string; title: string; content: string; recipientId?: string | null; courseId?: string | null },
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        const senderId = req.user?.userId || req.user?.id || req.user?.sub;
        const senderName = req.user?.name || req.user?.email || 'Sistema';
        return this.tenantDataService.createCommunication(resolvedInstitutionId, senderId, senderName, body);
    }

    @Get('classrooms')
    async getAulas(@Req() req: any, @Query('institutionId') institutionId?: string) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.getAulas(resolvedInstitutionId);
    }

    @Post('classrooms')
    async createAula(
        @Req() req: any,
        @Body()
        body: {
            name: string;
            color?: string;
            capacity?: number;
            teachers?: string[];
        },
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.createAula(resolvedInstitutionId, body);
    }

    @Put('classrooms/:id')
    async updateAula(
        @Req() req: any,
        @Param('id') aulaId: string,
        @Body()
        body: {
            name?: string;
            color?: string;
            capacity?: number;
            teachers?: string[];
        },
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.updateAula(resolvedInstitutionId, aulaId, body);
    }

    @Delete('classrooms/:id')
    async deleteAula(
        @Req() req: any,
        @Param('id') aulaId: string,
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.deleteAula(resolvedInstitutionId, aulaId);
    }

    @Get('children')
    async getNinos(@Req() req: any, @Query('institutionId') institutionId?: string) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.getNinos(resolvedInstitutionId);
    }

    @Post('children')
    async createNino(
        @Req() req: any,
        @Body()
        body: {
            name: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId: string;
            parentIds: string[];
            attendanceRate?: number;
        },
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.createNino(resolvedInstitutionId, body);
    }

    @Put('children/:id')
    async updateNino(
        @Req() req: any,
        @Param('id') ninoId: string,
        @Body()
        body: {
            name?: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId?: string;
            parentIds?: string[];
            attendanceRate?: number;
        },
        @Query('institutionId') institutionId?: string,
    ) {
        const resolvedInstitutionId = this.resolveInstitutionId(req, institutionId);
        return this.tenantDataService.updateNino(resolvedInstitutionId, ninoId, body);
    }
}
