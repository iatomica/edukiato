import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @Roles('SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE')
    create(@Body() createEventDto: CreateEventDto, @Req() req) {
        const institutionId = req.user.institutionId;
        const userId = req.user.id;
        return this.eventsService.create(createEventDto, institutionId, userId);
    }

    @Get()
    findAll(@Req() req) {
        const institutionId = req.user.institutionId;
        return this.eventsService.findAll(institutionId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req) {
        const institutionId = req.user.institutionId;
        return this.eventsService.findOne(id, institutionId);
    }

    @Put(':id')
    @Roles('SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE')
    update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() req) {
        const institutionId = req.user.institutionId;
        // We could add logic here: only the creator or admin can update the event.
        return this.eventsService.update(id, updateEventDto, institutionId);
    }

    @Delete(':id')
    @Roles('SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE')
    remove(@Param('id') id: string, @Req() req) {
        const institutionId = req.user.institutionId;
        // We could add logic here: only the creator or admin can delete the event.
        return this.eventsService.remove(id, institutionId);
    }
}
