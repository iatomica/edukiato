// Types copied from frontend to avoid build issues

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_INSTITUCION' | 'DOCENTE' | 'ESTUDIANTE';

export interface UserInstitution {
    institutionId: string;
    institutionName: string;
    institutionSlug: string;
    role: UserRole;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string;
    institutions?: UserInstitution[];
}
