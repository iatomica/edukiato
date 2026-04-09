/**
 * API Service Layer
 * 
 * Currently uses mock data as fallback (Decision D6 from architecture plan).
 * When backend is connected, replace mock implementations with fetch calls.
 * 
 * All data-fetching functions accept tenant context where applicable,
 * preparing for real multi-tenant API calls.
 */

import { User, UserRole, UserInstitution, Course, Message, AcademicReport } from '../types';
import { MOCK_COURSES, MOCK_PAYMENTS, INST_VINCULOS, MOCK_AULAS, MOCK_NINOS, MOCK_MESSAGES } from './mockData';

// ── Config ────────────────────────────────────────────────────

const API_BASE = '/api';
const USE_MOCK = false; // Toggle to false when backend is connected

// ── Mock Data for Auth ────────────────────────────────────────

const MOCK_INSTITUTIONS: UserInstitution[] = [
    {
        institutionId: 'inst-vinculos',
        institutionName: 'Vínculos de Libertad',
        institutionSlug: 'vinculos-de-libertad',
        role: 'ADMIN_INSTITUCION',
        logoUrl: 'https://picsum.photos/seed/vinculos/200',
        primaryColor: '#0ea5e9', // Lighter blue
        secondaryColor: '#0369a1',
    }
];

interface MockUser {
    emailPattern: string;
    user: Omit<User, 'institutions'>;
    institutions: UserInstitution[];
}

export const defaultMockUsers: any[] = [
    {
        emailPattern: 'joaquin.martinez.garcia',
        user: { id: 'u_staff_0', name: `Joaquin Martinez Garcia`, email: 'joaquin.martinez.garcia@demo.edu', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Joaquin%20Martinez%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.ruiz.sosa',
        user: { id: 'u_staff_1', name: `Camila Ruiz Sosa`, email: 'camila.ruiz.sosa@demo.edu', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Camila%20Ruiz%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.molina.castro',
        user: { id: 'u_staff_2', name: `Mia Molina Castro`, email: 'mia.molina.castro@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Molina%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.gimenez.ramos',
        user: { id: 'u_staff_3', name: `Martina Gimenez Ramos`, email: 'martina.gimenez.ramos@demo.edu', role: 'ADMIN_INSTITUCION', avatar: 'https://ui-avatars.com/api/?name=Martina%20Gimenez%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ADMIN_INSTITUCION' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucas.molina.alvarez',
        user: { id: 'u_staff_4', name: `Lucas Molina Alvarez`, email: 'lucas.molina.alvarez@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Lucas%20Molina%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.alvarez.sanchez',
        user: { id: 'u_staff_5', name: `Valeria Alvarez Sanchez`, email: 'valeria.alvarez.sanchez@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Alvarez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.romero.diaz',
        user: { id: 'u_staff_6', name: `Emma Romero Diaz`, email: 'emma.romero.diaz@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Romero%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.fernandez.gomez',
        user: { id: 'u_staff_7', name: `Diego Fernandez Gomez`, email: 'diego.fernandez.gomez@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Fernandez%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.sanchez.torres',
        user: { id: 'u_staff_8', name: `Martina Sanchez Torres`, email: 'martina.sanchez.torres@demo.edu', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Sanchez%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.sanchez.castro',
        user: { id: 'u_staff_9', name: `Valeria Sanchez Castro`, email: 'valeria.sanchez.castro@demo.edu', role: 'ADMIN_INSTITUCION', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Sanchez%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ADMIN_INSTITUCION' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.ruiz.garcia',
        user: { id: 'u_staff_10', name: `Emma Ruiz Garcia`, email: 'emma.ruiz.garcia@demo.edu', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Emma%20Ruiz%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.martinez.lopez',
        user: { id: 'u_staff_11', name: `Alejandro Martinez Lopez`, email: 'alejandro.martinez.lopez@demo.edu', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Martinez%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'laura.lopez.fernandez',
        user: { id: 'u_staff_12', name: `Laura Lopez Fernandez`, email: 'laura.lopez.fernandez@demo.edu', role: 'SUPER_ADMIN', avatar: 'https://ui-avatars.com/api/?name=Laura%20Lopez%20Fernandez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'SUPER_ADMIN' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.ramos.lopez',
        user: { id: 'u_staff_13', name: `Julia Ramos Lopez`, email: 'julia.ramos.lopez@demo.edu', role: 'SUPER_ADMIN', avatar: 'https://ui-avatars.com/api/?name=Julia%20Ramos%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'SUPER_ADMIN' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.castro.gimenez',
        user: { id: 'u_padre_0', name: `Emma Castro Gimenez`, email: 'emma.castro.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Castro%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.ruiz.garcia',
        user: { id: 'u_padre_1', name: `Mia Ruiz Garcia`, email: 'mia.ruiz.garcia@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Ruiz%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.ruiz.garcia',
        user: { id: 'u_estudiante_0', name: `Martina Ruiz Garcia`, email: 'martina.ruiz.garcia@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Ruiz%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.garcia.rodriguez',
        user: { id: 'u_padre_2', name: `Martina Garcia Rodriguez`, email: 'martina.garcia.rodriguez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Garcia%20Rodriguez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.ramos.ruiz',
        user: { id: 'u_padre_3', name: `Alejandro Ramos Ruiz`, email: 'alejandro.ramos.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Ramos%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.castro.castro',
        user: { id: 'u_estudiante_1', name: `Camila Castro Castro`, email: 'camila.castro.castro@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Castro%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.garcia.vazquez',
        user: { id: 'u_padre_4', name: `Sofia Garcia Vazquez`, email: 'sofia.garcia.vazquez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Garcia%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.gomez.sanchez',
        user: { id: 'u_padre_5', name: `Valeria Gomez Sanchez`, email: 'valeria.gomez.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Gomez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.martinez.perez',
        user: { id: 'u_estudiante_2', name: `Camila Martinez Perez`, email: 'camila.martinez.perez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Martinez%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.ruiz.alvarez',
        user: { id: 'u_padre_6', name: `Julia Ruiz Alvarez`, email: 'julia.ruiz.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Ruiz%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.perez.garcia',
        user: { id: 'u_padre_7', name: `Emma Perez Garcia`, email: 'emma.perez.garcia@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Perez%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.vazquez.alvarez',
        user: { id: 'u_estudiante_3', name: `Mateo Vazquez Alvarez`, email: 'mateo.vazquez.alvarez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Vazquez%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'joaquin.rodriguez.torres',
        user: { id: 'u_padre_8', name: `Joaquin Rodriguez Torres`, email: 'joaquin.rodriguez.torres@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Joaquin%20Rodriguez%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.torres.martinez',
        user: { id: 'u_estudiante_4', name: `Valentina Torres Martinez`, email: 'valentina.torres.martinez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Torres%20Martinez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucia.gimenez.perez',
        user: { id: 'u_padre_9', name: `Lucia Gimenez Perez`, email: 'lucia.gimenez.perez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Lucia%20Gimenez%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.molina.sosa',
        user: { id: 'u_padre_10', name: `Alvaro Molina Sosa`, email: 'alvaro.molina.sosa@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Molina%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucas.sanchez.gomez',
        user: { id: 'u_estudiante_5', name: `Lucas Sanchez Gomez`, email: 'lucas.sanchez.gomez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Lucas%20Sanchez%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.ruiz.torres',
        user: { id: 'u_padre_11', name: `Camila Ruiz Torres`, email: 'camila.ruiz.torres@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Ruiz%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.fernandez.molina',
        user: { id: 'u_padre_12', name: `Mateo Fernandez Molina`, email: 'mateo.fernandez.molina@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Fernandez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.ramos.garcia',
        user: { id: 'u_estudiante_6', name: `Mateo Ramos Garcia`, email: 'mateo.ramos.garcia@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Ramos%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.gomez.lopez',
        user: { id: 'u_padre_13', name: `Carlos Gomez Lopez`, email: 'carlos.gomez.lopez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Gomez%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.alvarez.gomez',
        user: { id: 'u_padre_14', name: `Valeria Alvarez Gomez`, email: 'valeria.alvarez.gomez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Alvarez%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.romero.castro',
        user: { id: 'u_estudiante_7', name: `Emma Romero Castro`, email: 'emma.romero.castro@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Romero%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.gomez.diaz',
        user: { id: 'u_padre_15', name: `Emma Gomez Diaz`, email: 'emma.gomez.diaz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Gomez%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'santiago.torres.alvarez',
        user: { id: 'u_padre_16', name: `Santiago Torres Alvarez`, email: 'santiago.torres.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Santiago%20Torres%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.ramos.martinez',
        user: { id: 'u_estudiante_8', name: `Camila Ramos Martinez`, email: 'camila.ramos.martinez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Ramos%20Martinez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.rodriguez.sanchez',
        user: { id: 'u_padre_17', name: `Martina Rodriguez Sanchez`, email: 'martina.rodriguez.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Rodriguez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucas.martinez.arias',
        user: { id: 'u_padre_18', name: `Lucas Martinez Arias`, email: 'lucas.martinez.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Lucas%20Martinez%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.alvarez.perez',
        user: { id: 'u_estudiante_9', name: `Alejandro Alvarez Perez`, email: 'alejandro.alvarez.perez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Alvarez%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.rodriguez.gimenez',
        user: { id: 'u_padre_19', name: `Alvaro Rodriguez Gimenez`, email: 'alvaro.rodriguez.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Rodriguez%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.garcia.alvarez',
        user: { id: 'u_padre_20', name: `Alvaro Garcia Alvarez`, email: 'alvaro.garcia.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Garcia%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.molina.ruiz',
        user: { id: 'u_estudiante_10', name: `Valeria Molina Ruiz`, email: 'valeria.molina.ruiz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Molina%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'joaquin.gimenez.molina',
        user: { id: 'u_padre_21', name: `Joaquin Gimenez Molina`, email: 'joaquin.gimenez.molina@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Joaquin%20Gimenez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hugo.castro.perez',
        user: { id: 'u_padre_22', name: `Hugo Castro Perez`, email: 'hugo.castro.perez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Hugo%20Castro%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.castro.perez',
        user: { id: 'u_estudiante_11', name: `Julia Castro Perez`, email: 'julia.castro.perez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Castro%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.gimenez.torres',
        user: { id: 'u_estudiante_12', name: `Diego Gimenez Torres`, email: 'diego.gimenez.torres@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Gimenez%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.molina.gomez',
        user: { id: 'u_padre_23', name: `Alejandro Molina Gomez`, email: 'alejandro.molina.gomez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Molina%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.rodriguez.garcia',
        user: { id: 'u_padre_24', name: `Alejandro Rodriguez Garcia`, email: 'alejandro.rodriguez.garcia@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Rodriguez%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.alvarez.ruiz',
        user: { id: 'u_estudiante_13', name: `Mia Alvarez Ruiz`, email: 'mia.alvarez.ruiz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Alvarez%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.diaz.ruiz',
        user: { id: 'u_padre_25', name: `Emma Diaz Ruiz`, email: 'emma.diaz.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Diaz%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.sanchez.gimenez',
        user: { id: 'u_padre_26', name: `Valentina Sanchez Gimenez`, email: 'valentina.sanchez.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Sanchez%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.romero.perez',
        user: { id: 'u_estudiante_14', name: `Camila Romero Perez`, email: 'camila.romero.perez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Romero%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.lopez.diaz',
        user: { id: 'u_estudiante_15', name: `Camila Lopez Diaz`, email: 'camila.lopez.diaz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Lopez%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.martinez.vazquez',
        user: { id: 'u_padre_27', name: `Camila Martinez Vazquez`, email: 'camila.martinez.vazquez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Martinez%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.alvarez.sanchez',
        user: { id: 'u_padre_28', name: `Julia Alvarez Sanchez`, email: 'julia.alvarez.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Alvarez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.gomez.diaz',
        user: { id: 'u_estudiante_16', name: `Daniel Gomez Diaz`, email: 'daniel.gomez.diaz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Gomez%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hugo.garcia.ramos',
        user: { id: 'u_padre_29', name: `Hugo Garcia Ramos`, email: 'hugo.garcia.ramos@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Hugo%20Garcia%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.fernandez.perez',
        user: { id: 'u_padre_30', name: `Emma Fernandez Perez`, email: 'emma.fernandez.perez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Fernandez%20Perez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.sanchez.sanchez',
        user: { id: 'u_estudiante_17', name: `Mateo Sanchez Sanchez`, email: 'mateo.sanchez.sanchez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Sanchez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.rodriguez.arias',
        user: { id: 'u_padre_31', name: `Daniel Rodriguez Arias`, email: 'daniel.rodriguez.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Rodriguez%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.perez.molina',
        user: { id: 'u_padre_32', name: `Valentina Perez Molina`, email: 'valentina.perez.molina@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Perez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.fernandez.alvarez',
        user: { id: 'u_estudiante_18', name: `Sofia Fernandez Alvarez`, email: 'sofia.fernandez.alvarez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Fernandez%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.gomez.ramos',
        user: { id: 'u_padre_33', name: `Carlos Gomez Ramos`, email: 'carlos.gomez.ramos@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Gomez%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.torres.sosa',
        user: { id: 'u_padre_34', name: `Emma Torres Sosa`, email: 'emma.torres.sosa@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Torres%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.lopez.gomez',
        user: { id: 'u_estudiante_19', name: `Carlos Lopez Gomez`, email: 'carlos.lopez.gomez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Lopez%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.perez.sanchez',
        user: { id: 'u_padre_35', name: `Martina Perez Sanchez`, email: 'martina.perez.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Perez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.castro.gimenez',
        user: { id: 'u_padre_36', name: `Mia Castro Gimenez`, email: 'mia.castro.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Castro%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valeria.ramos.gomez',
        user: { id: 'u_estudiante_20', name: `Valeria Ramos Gomez`, email: 'valeria.ramos.gomez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Valeria%20Ramos%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.gimenez.molina',
        user: { id: 'u_estudiante_21', name: `Sofia Gimenez Molina`, email: 'sofia.gimenez.molina@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Gimenez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hugo.sanchez.fernandez',
        user: { id: 'u_padre_37', name: `Hugo Sanchez Fernandez`, email: 'hugo.sanchez.fernandez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Hugo%20Sanchez%20Fernandez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.arias.molina',
        user: { id: 'u_estudiante_22', name: `Sofia Arias Molina`, email: 'sofia.arias.molina@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Arias%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'joaquin.diaz.castro',
        user: { id: 'u_padre_38', name: `Joaquin Diaz Castro`, email: 'joaquin.diaz.castro@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Joaquin%20Diaz%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.ruiz.ruiz',
        user: { id: 'u_padre_39', name: `Carlos Ruiz Ruiz`, email: 'carlos.ruiz.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Ruiz%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.ruiz.garcia',
        user: { id: 'u_estudiante_23', name: `Julia Ruiz Garcia`, email: 'julia.ruiz.garcia@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Ruiz%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.vazquez.ramos',
        user: { id: 'u_padre_40', name: `Valentina Vazquez Ramos`, email: 'valentina.vazquez.ramos@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Vazquez%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.gimenez.lopez',
        user: { id: 'u_padre_41', name: `Diego Gimenez Lopez`, email: 'diego.gimenez.lopez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Gimenez%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.arias.torres',
        user: { id: 'u_estudiante_24', name: `Daniel Arias Torres`, email: 'daniel.arias.torres@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Arias%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.romero.ruiz',
        user: { id: 'u_padre_42', name: `Daniel Romero Ruiz`, email: 'daniel.romero.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Romero%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.lopez.sosa',
        user: { id: 'u_padre_43', name: `Sofia Lopez Sosa`, email: 'sofia.lopez.sosa@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Lopez%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.garcia.vazquez',
        user: { id: 'u_estudiante_25', name: `Mateo Garcia Vazquez`, email: 'mateo.garcia.vazquez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Garcia%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.garcia.sanchez',
        user: { id: 'u_padre_44', name: `Martina Garcia Sanchez`, email: 'martina.garcia.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Garcia%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucia.alvarez.diaz',
        user: { id: 'u_padre_45', name: `Lucia Alvarez Diaz`, email: 'lucia.alvarez.diaz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Lucia%20Alvarez%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hugo.ramos.gomez',
        user: { id: 'u_estudiante_26', name: `Hugo Ramos Gomez`, email: 'hugo.ramos.gomez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Hugo%20Ramos%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.castro.arias',
        user: { id: 'u_padre_46', name: `Mateo Castro Arias`, email: 'mateo.castro.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Castro%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.alvarez.molina',
        user: { id: 'u_estudiante_27', name: `Diego Alvarez Molina`, email: 'diego.alvarez.molina@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Alvarez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.romero.gimenez',
        user: { id: 'u_padre_47', name: `Julia Romero Gimenez`, email: 'julia.romero.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Romero%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.gimenez.sanchez',
        user: { id: 'u_padre_48', name: `Daniel Gimenez Sanchez`, email: 'daniel.gimenez.sanchez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Gimenez%20Sanchez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucia.diaz.alvarez',
        user: { id: 'u_estudiante_28', name: `Lucia Diaz Alvarez`, email: 'lucia.diaz.alvarez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Lucia%20Diaz%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.fernandez.vazquez',
        user: { id: 'u_padre_49', name: `Mia Fernandez Vazquez`, email: 'mia.fernandez.vazquez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Fernandez%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.arias.gomez',
        user: { id: 'u_padre_50', name: `Julia Arias Gomez`, email: 'julia.arias.gomez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Arias%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucia.ruiz.garcia',
        user: { id: 'u_estudiante_29', name: `Lucia Ruiz Garcia`, email: 'lucia.ruiz.garcia@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Lucia%20Ruiz%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'laura.vazquez.ramos',
        user: { id: 'u_padre_51', name: `Laura Vazquez Ramos`, email: 'laura.vazquez.ramos@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Laura%20Vazquez%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.molina.martinez',
        user: { id: 'u_padre_52', name: `Mateo Molina Martinez`, email: 'mateo.molina.martinez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Molina%20Martinez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.romero.garcia',
        user: { id: 'u_estudiante_30', name: `Valentina Romero Garcia`, email: 'valentina.romero.garcia@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Romero%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.rodriguez.ruiz',
        user: { id: 'u_padre_53', name: `Martina Rodriguez Ruiz`, email: 'martina.rodriguez.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Rodriguez%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hugo.sanchez.romero',
        user: { id: 'u_padre_54', name: `Hugo Sanchez Romero`, email: 'hugo.sanchez.romero@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Hugo%20Sanchez%20Romero&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'laura.vazquez.sosa',
        user: { id: 'u_estudiante_31', name: `Laura Vazquez Sosa`, email: 'laura.vazquez.sosa@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Laura%20Vazquez%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.torres.gimenez',
        user: { id: 'u_padre_55', name: `Mia Torres Gimenez`, email: 'mia.torres.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Torres%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.romero.gomez',
        user: { id: 'u_padre_56', name: `Mia Romero Gomez`, email: 'mia.romero.gomez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Romero%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.castro.ruiz',
        user: { id: 'u_estudiante_32', name: `Alejandro Castro Ruiz`, email: 'alejandro.castro.ruiz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Castro%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.gomez.sosa',
        user: { id: 'u_padre_57', name: `Alejandro Gomez Sosa`, email: 'alejandro.gomez.sosa@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Gomez%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'santiago.martinez.vazquez',
        user: { id: 'u_padre_58', name: `Santiago Martinez Vazquez`, email: 'santiago.martinez.vazquez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Santiago%20Martinez%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sofia.ruiz.ruiz',
        user: { id: 'u_estudiante_33', name: `Sofia Ruiz Ruiz`, email: 'sofia.ruiz.ruiz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Sofia%20Ruiz%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'valentina.garcia.alvarez',
        user: { id: 'u_padre_59', name: `Valentina Garcia Alvarez`, email: 'valentina.garcia.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Valentina%20Garcia%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucas.castro.torres',
        user: { id: 'u_padre_60', name: `Lucas Castro Torres`, email: 'lucas.castro.torres@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Lucas%20Castro%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.ruiz.molina',
        user: { id: 'u_estudiante_34', name: `Julia Ruiz Molina`, email: 'julia.ruiz.molina@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Ruiz%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.ruiz.gomez',
        user: { id: 'u_padre_61', name: `Alvaro Ruiz Gomez`, email: 'alvaro.ruiz.gomez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Ruiz%20Gomez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.fernandez.lopez',
        user: { id: 'u_estudiante_35', name: `Daniel Fernandez Lopez`, email: 'daniel.fernandez.lopez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Fernandez%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mia.gimenez.arias',
        user: { id: 'u_padre_62', name: `Mia Gimenez Arias`, email: 'mia.gimenez.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mia%20Gimenez%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.romero.arias',
        user: { id: 'u_padre_63', name: `Julia Romero Arias`, email: 'julia.romero.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Romero%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucas.arias.fernandez',
        user: { id: 'u_estudiante_36', name: `Lucas Arias Fernandez`, email: 'lucas.arias.fernandez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Lucas%20Arias%20Fernandez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.sosa.alvarez',
        user: { id: 'u_padre_64', name: `Daniel Sosa Alvarez`, email: 'daniel.sosa.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Sosa%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.torres.ramos',
        user: { id: 'u_padre_65', name: `Julia Torres Ramos`, email: 'julia.torres.ramos@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Torres%20Ramos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.romero.rodriguez',
        user: { id: 'u_estudiante_37', name: `Alvaro Romero Rodriguez`, email: 'alvaro.romero.rodriguez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Romero%20Rodriguez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'laura.molina.ruiz',
        user: { id: 'u_padre_66', name: `Laura Molina Ruiz`, email: 'laura.molina.ruiz@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Laura%20Molina%20Ruiz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.molina.molina',
        user: { id: 'u_padre_67', name: `Carlos Molina Molina`, email: 'carlos.molina.molina@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Molina%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.rodriguez.sosa',
        user: { id: 'u_estudiante_38', name: `Alvaro Rodriguez Sosa`, email: 'alvaro.rodriguez.sosa@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Rodriguez%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.ramos.romero',
        user: { id: 'u_padre_68', name: `Diego Ramos Romero`, email: 'diego.ramos.romero@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Ramos%20Romero&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.sosa.castro',
        user: { id: 'u_padre_69', name: `Emma Sosa Castro`, email: 'emma.sosa.castro@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Sosa%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mateo.molina.romero',
        user: { id: 'u_estudiante_39', name: `Mateo Molina Romero`, email: 'mateo.molina.romero@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mateo%20Molina%20Romero&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.sanchez.torres',
        user: { id: 'u_padre_70', name: `Diego Sanchez Torres`, email: 'diego.sanchez.torres@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Sanchez%20Torres&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emma.alvarez.arias',
        user: { id: 'u_padre_71', name: `Emma Alvarez Arias`, email: 'emma.alvarez.arias@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Emma%20Alvarez%20Arias&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.fernandez.fernandez',
        user: { id: 'u_estudiante_40', name: `Diego Fernandez Fernandez`, email: 'diego.fernandez.fernandez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Fernandez%20Fernandez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.sosa.lopez',
        user: { id: 'u_padre_72', name: `Alejandro Sosa Lopez`, email: 'alejandro.sosa.lopez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Sosa%20Lopez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.diaz.diaz',
        user: { id: 'u_estudiante_41', name: `Alejandro Diaz Diaz`, email: 'alejandro.diaz.diaz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Diaz%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.fernandez.garcia',
        user: { id: 'u_padre_73', name: `Martina Fernandez Garcia`, email: 'martina.fernandez.garcia@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Fernandez%20Garcia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'daniel.vazquez.romero',
        user: { id: 'u_padre_74', name: `Daniel Vazquez Romero`, email: 'daniel.vazquez.romero@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniel%20Vazquez%20Romero&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'laura.romero.castro',
        user: { id: 'u_estudiante_42', name: `Laura Romero Castro`, email: 'laura.romero.castro@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Laura%20Romero%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.torres.alvarez',
        user: { id: 'u_padre_75', name: `Julia Torres Alvarez`, email: 'julia.torres.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Torres%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'martina.castro.alvarez',
        user: { id: 'u_padre_76', name: `Martina Castro Alvarez`, email: 'martina.castro.alvarez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martina%20Castro%20Alvarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvaro.sanchez.molina',
        user: { id: 'u_estudiante_43', name: `Alvaro Sanchez Molina`, email: 'alvaro.sanchez.molina@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alvaro%20Sanchez%20Molina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'carlos.gimenez.castro',
        user: { id: 'u_padre_77', name: `Carlos Gimenez Castro`, email: 'carlos.gimenez.castro@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Gimenez%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diego.diaz.sosa',
        user: { id: 'u_padre_78', name: `Diego Diaz Sosa`, email: 'diego.diaz.sosa@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Diaz%20Sosa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'camila.vazquez.diaz',
        user: { id: 'u_estudiante_44', name: `Camila Vazquez Diaz`, email: 'camila.vazquez.diaz@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Camila%20Vazquez%20Diaz&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julia.arias.martinez',
        user: { id: 'u_padre_79', name: `Julia Arias Martinez`, email: 'julia.arias.martinez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Julia%20Arias%20Martinez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucia.molina.gimenez',
        user: { id: 'u_padre_80', name: `Lucia Molina Gimenez`, email: 'lucia.molina.gimenez@demo.edu', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Lucia%20Molina%20Gimenez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alejandro.alvarez.vazquez',
        user: { id: 'u_estudiante_45', name: `Alejandro Alvarez Vazquez`, email: 'alejandro.alvarez.vazquez@demo.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Alejandro%20Alvarez%20Vazquez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
];

const storedUsers = null; // typeof window !== 'undefined' ? localStorage.getItem('MOCK_USERS') : null;
const defaultMockUsersLinked = defaultMockUsers.map(m => ({
    ...m,
    user: {
        ...m.user,
        requiresPasswordChange: !['SUPER_ADMIN', 'ADMIN_INSTITUCION'].includes(m.user.role),
        passwordHash: 'vinculos' // Default mock password
    }
}));
export let MOCK_USERS: MockUser[] = storedUsers ? JSON.parse(storedUsers) : defaultMockUsersLinked;

// ── Auth API ──────────────────────────────────────────────────

export const authApi = {
    login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
        if (USE_MOCK) {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern))
                || MOCK_USERS[MOCK_USERS.length - 1]; // Fallback to student

            // Password validation for all users in mock mode
            const isInstitutional = ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(found.user.role);

            // Check against stored mock password
            if (_password !== found.user.passwordHash) {
                // Allow fallback if they haven't explicitly set a password and try 'vinculos'
                if (!(_password === 'vinculos' && found.user.passwordHash === 'vinculos')) {
                    throw new Error('Credenciales inválidas');
                }
            }

            const user: User = {
                ...found.user,
                institutions: found.institutions,
            };

            return {
                user,
                token: `mock-jwt-${user.id}-${Date.now()}`,
            };
        }

        // Real API call (future)
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: _password }),
            });

            if (!response.ok) {
                throw new Error('Fallback to mock'); // Forzamos el fallback local
            }

            const data = await response.json();
            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern))
                || MOCK_USERS[MOCK_USERS.length - 1]; // Fallback to student institutions for demo

            // Password validation for Institutional users on API success too
            const isInstitutional = ['SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESPECIALES'].includes(found.user.role);
            if (isInstitutional && _password !== 'vinculos') {
                throw new Error('Credenciales inválidas');
            }

            const user: User = {
                id: data.user?.id || 'unknown',
                name: data.user?.full_name || data.user?.name || found.user.name,
                email: data.user?.email || email,
                role: data.user?.role || found.user.role,
                avatar: data.user?.avatar || found.user.avatar,
                institutions: found.institutions,
            };

            return {
                user,
                token: data.access_token || data.token || `mock-jwt-${user.id}-${Date.now()}`,
            };
        } catch (error: any) {
            // Si el backend real falla o no existe, usamos la validación Mock al 100%
            if (error.message === 'Credenciales inválidas') {
                throw error; // Propagar error de contraseña institucional si falló
            }

            console.warn("Falling back to MOCK login validation.", error.message);
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 600));

            const found = MOCK_USERS.find(u => u.user.email.toLowerCase() === email.toLowerCase())
                || MOCK_USERS.find(u => email.toLowerCase().includes(u.emailPattern));

            if (!found) {
                throw new Error('Usuario no encontrado o credenciales inválidas');
            }

            // Password validation for all users in mock fallback
            if (_password !== found.user.passwordHash) {
                // Allow fallback if they haven't explicitly set a password and try 'vinculos'
                if (!(_password === 'vinculos' && found.user.passwordHash === 'vinculos')) {
                    throw new Error('Credenciales inválidas');
                }
            }

            const user: User = {
                ...found.user,
                institutions: found.institutions,
            };

            return {
                user,
                token: `mock-jwt-${user.id}-${Date.now()}`,
            };
        }
    },
    setInitialPassword: async (userId: string, newPassword: string): Promise<{ success: boolean }> => {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const mockIndex = MOCK_USERS.findIndex(u => u.user.id === userId);
            if (mockIndex >= 0) {
                MOCK_USERS[mockIndex].user.requiresPasswordChange = false;
                MOCK_USERS[mockIndex].user.passwordHash = newPassword;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
                }
                return { success: true };
            }
            throw new Error('Usuario no encontrado');
        }

        const response = await fetch(`${API_BASE}/auth/set-initial-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, newPassword }),
        });

        if (!response.ok) {
            // Fallback a fallback mock
            const mockIndex = MOCK_USERS.findIndex(u => u.user.id === userId);
            if (mockIndex >= 0) {
                MOCK_USERS[mockIndex].user.requiresPasswordChange = false;
                MOCK_USERS[mockIndex].user.passwordHash = newPassword;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
                }
                return { success: true };
            }
            throw new Error('Error cambiando la contraseña');
        }
        return { success: true };
    }
};

// ── Institutions API ──────────────────────────────────────────

export const institutionsApi = {
    getAll: async (token: string): Promise<UserInstitution[]> => {
        const response = await fetch(`${API_BASE}/institutions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching institutions');
        const data = await response.json();
        // Map backend institution objects to UserInstitution type expected by frontend
        return data.map((inst: any) => ({
            institutionId: inst.id,
            institutionName: inst.name,
            institutionSlug: inst.slug,
            role: 'ADMIN_INSTITUCION', // Temporarily hardcoded until we fetch from user_institution_roles
            logoUrl: inst.logoUrl,
            primaryColor: inst.primaryColor,
            secondaryColor: inst.secondaryColor
        }));
    },
    create: async (data: Partial<UserInstitution>, token: string): Promise<UserInstitution> => {
        const response = await fetch(`${API_BASE}/institutions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: data.institutionName,
                slug: data.institutionName?.toLowerCase().replace(/\s+/g, '-'),
                primaryColor: data.primaryColor || '#14b8a6',
                secondaryColor: data.secondaryColor || '#0f766e',
                logoUrl: data.logoUrl
            })
        });
        if (!response.ok) throw new Error('Error creating institution');
        const inst = await response.json();
        return {
            institutionId: inst.id,
            institutionName: inst.name,
            institutionSlug: inst.slug,
            role: 'ADMIN_INSTITUCION',
            logoUrl: inst.logoUrl,
            primaryColor: inst.primaryColor,
            secondaryColor: inst.secondaryColor
        };
    }, // Changed semicolon to comma
}; // Closed institutionsApi object

// ── Users API ─────────────────────────────────────────────────

export const usersApi = {
    getAll: async (institutionId: string, token: string): Promise<User[]> => {
        try {
            const response = await fetch(`${API_BASE}/users?institutionId=${institutionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error fetching users');
            const data = await response.json();
            if (data && data.length > 0) return data;
            return MOCK_USERS.map(m => m.user);
        } catch (error) {
            console.warn("Falling back to MOCK_USERS for users directory.");
            return MOCK_USERS.map(m => m.user);
        }
    },

    create: async (data: Partial<User>, institutionId: string, token: string): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    role: data.role || 'ESTUDIANTE',
                    institutionId: institutionId
                })
            });
            if (!response.ok) throw new Error('Error creating user');
            return await response.json();
        } catch (error) {
            console.warn("Mocking user creation fallback.");
            const newUser: User = {
                id: `new_user_${Date.now()}`,
                name: data.name || 'Nuevo Usuario',
                email: data.email || 'nuevo@ejemplo.com',
                role: data.role as UserRole || 'DOCENTE',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'N U')}`
            };
            MOCK_USERS.push({
                emailPattern: newUser.email,
                user: newUser,
                institutions: [{ ...MOCK_INSTITUTIONS[0], role: newUser.role }]
            });
            if (typeof window !== 'undefined') localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
            return newUser;
        }
    },

    update: async (userId: string, data: Partial<User>, token: string): Promise<User> => {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Error updating user');
            return await response.json();
        } catch (error) {
            console.warn("Mocking user update fallback.");
            const mockIndex = MOCK_USERS.findIndex(m => m.user.id === userId);
            if (mockIndex >= 0) {
                MOCK_USERS[mockIndex].user = { ...MOCK_USERS[mockIndex].user, ...data };
                if (data.role) {
                    MOCK_USERS[mockIndex].institutions[0].role = data.role;
                }
                if (typeof window !== 'undefined') localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
                return MOCK_USERS[mockIndex].user;
            }
            throw new Error("Usuario no encontrado en los datos de prueba");
        }
    },

    resetPassword: async (userId: string, token: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_BASE}/users/${userId}/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error resetting password');
            return await response.json();
        } catch (error) {
            console.warn("Mocking password reset fallback.");
            const mockIndex = MOCK_USERS.findIndex(m => m.user.id === userId);
            if (mockIndex < 0) throw new Error("Usuario no encontrado");

            // Forzar el recambio de clave la proxima vez
            MOCK_USERS[mockIndex].user.requiresPasswordChange = true;
            MOCK_USERS[mockIndex].user.passwordHash = 'vinculos';
            if (typeof window !== 'undefined') {
                localStorage.setItem('MOCK_USERS', JSON.stringify(MOCK_USERS));
            }

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 800));
            return {
                success: true,
                message: `Clave restablecida a "vinculos". Se ha enviado un aviso a ${MOCK_USERS[mockIndex].user.email}`
            };
        }
    }
};

// ── Courses API ───────────────────────────────────────────────

export const coursesApi = {
    getAll: async (institutionId: string, token: string): Promise<Course[]> => {
        const response = await fetch(`${API_BASE}/courses?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching courses');
        const data = await response.json();
        return data.map((c: any) => ({
            id: c.id,
            institutionId: c.institutionId || institutionId,
            courseType: c.courseType || 'REGULAR',
            title: c.title,
            instructor: c.instructor?.name || c.instructor || 'TBD',
            schedule: c.schedule || 'TBD',
            enrolled: c.enrolledCount || 0,
            capacity: c.capacity || 15,
            image: c.image || 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&w=800',
            tags: c.tags || [],
            nextSession: c.nextSession?.date || 'TBD',
            description: c.description
        }));
    },

    create: async (data: Partial<Course>, token: string): Promise<Course> => {
        const response = await fetch(`${API_BASE}/courses`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error creating course');
        const c = await response.json();
        return {
            id: c.id,
            institutionId: c.institutionId || data.institutionId,
            courseType: c.courseType || 'REGULAR',
            title: c.title,
            instructor: c.instructor?.name || c.instructor || 'TBD',
            schedule: c.schedule || 'TBD',
            enrolled: c.enrolledCount || 0,
            capacity: c.capacity || 15,
            image: c.image || 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&w=800',
            tags: c.tags || [],
            nextSession: c.nextSession?.date || 'TBD',
            description: c.description
        };
    }
};

// ── Messages API ──────────────────────────────────────────────

// --- Utilities for cross-tab mock sync ---
const refreshMockMessages = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('MOCK_MESSAGES');
        if (stored) {
            Object.assign(MOCK_MESSAGES, JSON.parse(stored));
        }
    }
};

export const messagesApi = {
    getMessages: async (userId: string, targetUserId: string, token: string): Promise<Message[]> => {
        refreshMockMessages();
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        // Enforce the same key regardless of who is sender/receiver
        const chatId = [userId, targetUserId].sort().join('|');
        return MOCK_MESSAGES[chatId] || [];
    },

    sendMessage: async (senderId: string, recipientId: string, content: string, token: string, file?: Message['file']): Promise<Message> => {
        refreshMockMessages();
        // Simular retraso de red
        await new Promise(resolve => setTimeout(resolve, 300));

        const chatId = [senderId, recipientId].sort().join('|');

        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            senderId,
            content,
            timestamp: new Date(),
            isRead: false,
            ...(file && { file })
        };

        if (!MOCK_MESSAGES[chatId]) {
            MOCK_MESSAGES[chatId] = [];
        }

        MOCK_MESSAGES[chatId].push(newMessage);
        if (typeof window !== 'undefined') {
            localStorage.setItem('MOCK_MESSAGES', JSON.stringify(MOCK_MESSAGES));
            window.dispatchEvent(new Event('MOCK_MESSAGES_UPDATED'));
        }
        return newMessage;
    },

    getConversations: async (userId: string, token: string): Promise<{ contactId: string, lastMessage: Message, unreadCount: number }[]> => {
        refreshMockMessages();
        // Fast response for polling
        const conversations: { contactId: string, lastMessage: Message, unreadCount: number }[] = [];

        for (const [chatId, messages] of Object.entries(MOCK_MESSAGES)) {
            const ids = chatId.split('|');
            if (ids.includes(userId) && messages.length > 0) {
                const contactId = ids[0] === userId ? ids[1] : ids[0];
                const lastMessage = messages[messages.length - 1];
                const unreadCount = messages.filter(m => m.senderId !== userId && !m.isRead).length;
                conversations.push({ contactId, lastMessage, unreadCount });
            }
        }

        // Sort by most recent message
        return conversations.sort((a, b) =>
            new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
        );
    },

    markAsRead: async (userId: string, targetUserId: string, token: string): Promise<void> => {
        refreshMockMessages();
        const chatId = [userId, targetUserId].sort().join('|');
        const messages = MOCK_MESSAGES[chatId];

        if (messages) {
            let updated = false;
            messages.forEach(m => {
                if (m.senderId !== userId && !m.isRead) {
                    m.isRead = true;
                    updated = true;
                }
            });
            if (updated && typeof window !== 'undefined') {
                localStorage.setItem('MOCK_MESSAGES', JSON.stringify(MOCK_MESSAGES));
                window.dispatchEvent(new Event('MOCK_MESSAGES_UPDATED'));
            }
        }
    }
};

// ── Reports API ───────────────────────────────────────────────

const storedReports = typeof window !== 'undefined' ? localStorage.getItem('MOCK_REPORTS') : null;
let MOCK_REPORTS: AcademicReport[] = storedReports ? JSON.parse(storedReports) : [];

export const reportsApi = {
    create: async (studentId: string, title: string, content: string, token: string): Promise<{ message: string, report: AcademicReport }> => {
        try {
            const response = await fetch(`${API_BASE}/reports/student/${studentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error creando informe');
            }
            return response.json();
        } catch (error: any) {
            console.warn('Backend unavailable, using mock data for reports...', error.message);
            // Fallback to Mock / LocalStorage
            let uploaderId = 'u_dir'; // default fallback
            try {
                const parts = token.split('-');
                if (parts.length > 2) uploaderId = parts[2];
            } catch (e) { }

            const newReport: AcademicReport = {
                id: `mock-report-${Date.now()}`,
                studentId,
                uploaderId,
                title,
                content,
                createdAt: new Date().toISOString()
            };
            MOCK_REPORTS.push(newReport);
            if (typeof window !== 'undefined') {
                localStorage.setItem('MOCK_REPORTS', JSON.stringify(MOCK_REPORTS));
            }
            return { message: 'Informe guardado (Mock)', report: newReport };
        }
    },
    getByStudent: async (studentId: string, token: string): Promise<AcademicReport[]> => {
        try {
            const response = await fetch(`${API_BASE}/reports/student/${studentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar informes');
            return response.json();
        } catch (error: any) {
            console.warn('Backend unavailable, using mock reports...', error.message);
            return MOCK_REPORTS
                .filter(r => r.studentId === studentId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
    }
};
