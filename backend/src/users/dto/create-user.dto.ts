import { IsString, IsEmail, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsIn(['ESTUDIANTE', 'DOCENTE', 'ADMIN_INSTITUCION', 'SUPER_ADMIN'])
    role: string;

    @IsString()
    @IsOptional()
    institutionId?: string;
}
