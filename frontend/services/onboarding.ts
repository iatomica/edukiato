
import { UserRole, OnboardingStep } from '../types';

export const ONBOARDING_STEPS: Record<UserRole, OnboardingStep[]> = {
    SUPER_ADMIN: [], // Not needed for now
    PADRE: [],
    ESPECIALES: [],

    ADMIN_INSTITUCION: [
        {
            id: 'setup_institution',
            title: 'Configurá tu Institución',
            description: 'Define el nombre, logo y colores de tu escuela.',
            targetView: 'dashboard', // Ideally settings
            actionLabel: 'Ir a Configuración',
        },
        {
            id: 'create_course',
            title: 'Creá tu Primer Curso',
            description: 'Agrega una materia, asigna un profesor y define horarios.',
            targetView: 'courses',
            actionLabel: 'Crear Curso',
        },
        {
            id: 'invite_students',
            title: 'Registra Estudiantes',
            description: 'Sube la nómina de alumnos para darles acceso.',
            targetView: 'students',
            actionLabel: 'Ir a Estudiantes',
        },
    ],

    DOCENTE: [
        {
            id: 'view_schedule',
            title: 'Revisá tu Horario',
            description: 'Confirma tus horarios de clase asignados.',
            targetView: 'schedule',
            actionLabel: 'Ver Calendario',
        },
        {
            id: 'publish_content',
            title: 'Publicá Contenido',
            description: 'Sube una tarea o anuncio para tus alumnos.',
            targetView: 'classroom',
            actionLabel: 'Ir al Aula',
        },
        {
            id: 'take_attendance',
            title: 'Tomar Asistencia',
            description: 'Registra la asistencia de tu primera clase.',
            targetView: 'schedule',
            actionLabel: 'Ver Clases',
        },
    ],

    ESTUDIANTE: [
        {
            id: 'explore_courses',
            title: 'Explorá tus Cursos',
            description: 'Mira las materias en las que estás inscrito.',
            targetView: 'classroom',
            actionLabel: 'Ver Mis Cursos',
        },
        {
            id: 'check_schedule',
            title: 'Revisá tu Horario',
            description: 'No te pierdas ninguna clase. Mira tu calendario.',
            targetView: 'schedule',
            actionLabel: 'Ver Calendario',
        },
    ],
};

export const getOnboardingSteps = (role: UserRole): OnboardingStep[] => {
    return ONBOARDING_STEPS[role] || [];
};
