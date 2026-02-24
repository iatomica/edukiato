import { IsString, IsNotEmpty, IsOptional, IsHexColor, IsIn } from 'class-validator';

export class CreateInstitutionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsOptional()
    logoUrl?: string;

    @IsHexColor()
    @IsOptional()
    primaryColor?: string;

    @IsHexColor()
    @IsOptional()
    secondaryColor?: string;

    @IsIn(['FREE', 'PRO', 'ENTERPRISE'])
    @IsOptional()
    plan?: 'FREE' | 'PRO' | 'ENTERPRISE';
}
