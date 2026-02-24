import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    findAll(@Query('institutionId') institutionId?: string) {
        return this.usersService.findAll(institutionId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto, @Request() req) {
        // In a real app, verify req.user has permissions (e.g. ADMIN_INSTITUCION) 
        // to create users for the requested institutionId.
        // For now we trust the payload or fallback to a dummy ID if not provided.
        const targetInstitutionId = createUserDto.institutionId || 'inst-001';
        return this.usersService.create(createUserDto, targetInstitutionId);
    }
}
