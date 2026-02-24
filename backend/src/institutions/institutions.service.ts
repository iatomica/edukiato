import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import * as crypto from 'crypto';

@Injectable()
export class InstitutionsService {
    // Temporary in-memory store since there is no DB connection yet
    private institutions = [
        {
            id: 'inst_arte_123',
            name: 'Instituto de Arte Contemporáneo',
            slug: 'instituto-arte',
            logoUrl: 'https://images.unsplash.com/photo-1544605151-6c2e22c9f91a?auto=format&fit=crop&q=80&w=200&h=200',
            primaryColor: '#0f766e',
            secondaryColor: '#1e293b',
            plan: 'FREE',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: 'inst_tech_456',
            name: 'Academia Tech & Código',
            slug: 'academia-tech',
            logoUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=200&h=200',
            primaryColor: '#4f46e5',
            secondaryColor: '#0f172a',
            plan: 'PRO',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    findAll() {
        return this.institutions;
    }

    findOne(id: string) {
        const institution = this.institutions.find(i => i.id === id);
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${id} not found`);
        }
        return institution;
    }

    create(createDto: CreateInstitutionDto, userId: string) {
        const newInst = {
            id: `inst_${crypto.randomUUID()}`,
            name: createDto.name,
            slug: createDto.slug,
            logoUrl: createDto.logoUrl || null,
            primaryColor: createDto.primaryColor || '#14b8a6',
            secondaryColor: createDto.secondaryColor || '#0f766e',
            plan: createDto.plan || 'FREE',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.institutions.push(newInst);

        // In a real database, we would also insert into `user_institution_roles` here 
        // to link the creating user as ADMIN_INSTITUCION

        return newInst;
    }
}
