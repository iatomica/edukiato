import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { InstitutionsService } from './institutions.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('institutions')
export class InstitutionsController {
    constructor(private readonly institutionsService: InstitutionsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.institutionsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.institutionsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createInstitutionDto: CreateInstitutionDto, @Request() req) {
        // The JWT guard injects the user payload into req.user
        const userId = req.user.sub || 'unknown';
        return this.institutionsService.create(createInstitutionDto, userId);
    }
}
