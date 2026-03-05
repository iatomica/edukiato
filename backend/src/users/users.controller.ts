import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(@Query('institutionId') institutionId?: string) {
        return this.usersService.findAll(institutionId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Request() req) {
        const targetInstitutionId = createUserDto.institutionId || 'inst-001';
        return this.usersService.create(createUserDto, targetInstitutionId);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateData: Partial<CreateUserDto>) {
        return this.usersService.update(id, updateData);
    }

    @Post(':id/reset-password')
    async resetPassword(@Param('id') id: string) {
        return this.usersService.resetPassword(id);
    }
}
