/**
 * API Service Layer
 * 
 * Currently uses mock data as fallback (Decision D6 from architecture plan).
 * When backend is connected, replace mock implementations with fetch calls.
 * 
 * All data-fetching functions accept tenant context where applicable,
 * preparing for real multi-tenant API calls.
 */

import { User, UserInstitution, Course, Message, AcademicReport, Communication, Aula, Nino, CalendarEvent } from '@/types';

// ── Config ────────────────────────────────────────────────────

const API_BASE = '/api';

interface MockUser {
    emailPattern: string;
    user: Omit<User, 'institutions'>;
    institutions: UserInstitution[];
}

export const defaultMockUsers: any[] = [
    {
        emailPattern: 'porisilva92',
        user: { id: 'u_staff_0', name: `Gabriel Silva`, email: 'porisilva92@gmail.com', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Gabriel%20Silva&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'leonardovidela86',
        user: { id: 'u_staff_1', name: `Leonardo Videla`, email: 'leonardovidela86@gmail.com', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Leonardo%20Videla&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'fiorelasotelo63',
        user: { id: 'u_staff_2', name: `Fiorela Sotelo`, email: 'fiorelasotelo63@gmail.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Fiorela%20Sotelo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lore0377',
        user: { id: 'u_staff_3', name: `Lorena Mori`, email: 'lore0377@gmail.com', role: 'ADMIN_INSTITUCION', avatar: 'https://ui-avatars.com/api/?name=Lorena%20Mori&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ADMIN_INSTITUCION' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'romieng16',
        user: { id: 'u_staff_4', name: `Romina Engel`, email: 'romieng16@outlook.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Romina%20Engel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvarengarominaf',
        user: { id: 'u_staff_5', name: `Romina Alvarenga`, email: 'alvarengarominaf@gmail.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Romina%20Alvarenga&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'antomiche49',
        user: { id: 'u_staff_6', name: `Antonela Michelena`, email: 'antomiche49@gmail.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Antonela%20Michelena&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'nellyfigue168',
        user: { id: 'u_staff_7', name: `Nellida Figueroa`, email: 'nellyfigue168@gmail.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Nellida%20Figueroa&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'stefaniabhl',
        user: { id: 'u_staff_8', name: `Stefanía Bahl`, email: 'stefaniabhl@gmail.com', role: 'DOCENTE', avatar: 'https://ui-avatars.com/api/?name=Stefan%C3%ADa%20Bahl&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'DOCENTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lalastamponi',
        user: { id: 'u_staff_9', name: `María Laura Stamponi`, email: 'lalastamponi@gmail.com', role: 'ADMIN_INSTITUCION', avatar: 'https://ui-avatars.com/api/?name=Mar%C3%ADa%20Laura%20Stamponi&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ADMIN_INSTITUCION' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'solduarte55',
        user: { id: 'u_staff_10', name: `Sol Duarte`, email: 'solduarte55@gmail.com', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Sol%20Duarte&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guillecandombe',
        user: { id: 'u_staff_11', name: `Guillermo Peirano`, email: 'guillecandombe@gmail.com', role: 'ESPECIALES', avatar: 'https://ui-avatars.com/api/?name=Guillermo%20Peirano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESPECIALES' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'seilarg',
        user: { id: 'u_staff_12', name: `Seila Ramos González`, email: 'seilarg@hotmail.com', role: 'SUPER_ADMIN', avatar: 'https://ui-avatars.com/api/?name=Seila%20Ramos%20Gonz%C3%A1lez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'SUPER_ADMIN' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'rushayala87',
        user: { id: 'u_staff_13', name: `Romina Ayala`, email: 'rushayala87@gmail.com', role: 'SUPER_ADMIN', avatar: 'https://ui-avatars.com/api/?name=Romina%20Ayala&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'SUPER_ADMIN' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'avendanosancha',
        user: { id: 'u_padre_0', name: `Avendaño Sancha Gisel Ximena`, email: 'avendanosancha@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Avenda%C3%B1o%20Sancha%20Gisel%20Ximena&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'd.alvarez77',
        user: { id: 'u_padre_1', name: `Álvarez Diego Matías`, email: 'd.alvarez77@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Diego%20Mat%C3%ADas&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvarez.nina',
        user: { id: 'u_estudiante_0', name: `Álvarez Nina`, email: 'alvarez.nina@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Nina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'micalamarquee',
        user: { id: 'u_padre_2', name: `Micaela Lamarque`, email: 'micalamarquee@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Micaela%20Lamarque&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'nicolasbattini',
        user: { id: 'u_padre_3', name: `Nicolás Battini`, email: 'nicolasbattini@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Nicol%C3%A1s%20Battini&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'battini.lamarque.manuel',
        user: { id: 'u_estudiante_1', name: `Battini Lamarque Manuel`, email: 'battini.lamarque.manuel@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Battini%20Lamarque%20Manuel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'agostinarinaldi',
        user: { id: 'u_padre_4', name: `Rinaldi Agostina`, email: 'agostinarinaldi@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Rinaldi%20Agostina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'ndcisneros',
        user: { id: 'u_padre_5', name: `Cisneros Néstor David`, email: 'ndcisneros@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Cisneros%20N%C3%A9stor%20David&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'cisneros.rinaldi.anna',
        user: { id: 'u_estudiante_2', name: `Cisneros Rinaldi Anna`, email: 'cisneros.rinaldi.anna@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Anna&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sanromanm25',
        user: { id: 'u_padre_6', name: `San Román Micaela`, email: 'sanromanm25@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=San%20Rom%C3%A1n%20Micaela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'nicoespi099',
        user: { id: 'u_padre_7', name: `Espinoza Aron Nicolás Gabriel`, email: 'nicoespi099@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Espinoza%20Aron%20Nicol%C3%A1s%20Gabriel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'espinosa.san.roman.alaia',
        user: { id: 'u_estudiante_3', name: `Espinosa San Román Alaia`, email: 'espinosa.san.roman.alaia@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Espinosa%20San%20Rom%C3%A1n%20Alaia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'eric1994hughes',
        user: { id: 'u_padre_8', name: `Hughes John Eric`, email: 'eric1994hughes@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Hughes%20John%20Eric&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'hughes.sotelo.lisandro',
        user: { id: 'u_estudiante_4', name: `Hughes Sotelo Lisandro`, email: 'hughes.sotelo.lisandro@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Hughes%20Sotelo%20Lisandro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'persicocandela',
        user: { id: 'u_padre_9', name: `Pérsico María Candela`, email: 'persicocandela@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=P%C3%A9rsico%20Mar%C3%ADa%20Candela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'juan.more.no.est',
        user: { id: 'u_padre_10', name: `Moreno Juan Andrés`, email: 'juan.more.no.est@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Moreno%20Juan%20Andr%C3%A9s&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'moreno.persico.valentin',
        user: { id: 'u_estudiante_5', name: `Moreno Pérsico Valentín`, email: 'moreno.persico.valentin@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Moreno%20P%C3%A9rsico%20Valent%C3%ADn&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'salome.diaz982015',
        user: { id: 'u_padre_11', name: `Diaz María Salomé`, email: 'salome.diaz982015@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diaz%20Mar%C3%ADa%20Salom%C3%A9&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'pablorocha94',
        user: { id: 'u_padre_12', name: `Rocha Juan Pablo`, email: 'pablorocha94@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Rocha%20Juan%20Pablo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'rocha.bruno',
        user: { id: 'u_estudiante_6', name: `Rocha Bruno`, email: 'rocha.bruno@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Rocha%20Bruno&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'yaninapellegrino',
        user: { id: 'u_padre_13', name: `Pérez Pellegrino Yanina`, email: 'yaninapellegrino@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=P%C3%A9rez%20Pellegrino%20Yanina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'licob2003',
        user: { id: 'u_padre_14', name: `Sánchez María Laura`, email: 'licob2003@yahoo.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Mar%C3%ADa%20Laura&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sanchez.felipe',
        user: { id: 'u_estudiante_7', name: `Sánchez Felipe`, email: 'sanchez.felipe@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Felipe&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'angieg.suarez',
        user: { id: 'u_padre_15', name: `Angie Guadalupe Suarez`, email: 'angieg.suarez@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Angie%20Guadalupe%20Suarez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guillermosegatti',
        user: { id: 'u_padre_16', name: `Segatti Guillermo Andrés`, email: 'guillermosegatti@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Segatti%20Guillermo%20Andr%C3%A9s&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'segatti.suarez.stefano',
        user: { id: 'u_estudiante_8', name: `Segatti Suarez Stefano`, email: 'segatti.suarez.stefano@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Segatti%20Suarez%20Stefano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucybogado55',
        user: { id: 'u_padre_17', name: `Bogado Bustos Lucy del Pilar`, email: 'lucybogado55@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Bogado%20Bustos%20Lucy%20del%20Pilar&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lucasr.pm',
        user: { id: 'u_padre_18', name: `Ríos Hernández Lucas Emanuel`, email: 'lucasr.pm@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=R%C3%ADos%20Hern%C3%A1ndez%20Lucas%20Emanuel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'bogado.rios.coco',
        user: { id: 'u_estudiante_9', name: `Bogado Ríos Coco`, email: 'bogado.rios.coco@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Bogado%20R%C3%ADos%20Coco&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'antonelamartelli',
        user: { id: 'u_padre_19', name: `Martelli Antonela`, email: 'antonelamartelli@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Martelli%20Antonela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'fernandocevoli',
        user: { id: 'u_padre_20', name: `Cevoli Fernando`, email: 'fernandocevoli@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Cevoli%20Fernando&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'cevoli.charo',
        user: { id: 'u_estudiante_10', name: `Cevoli Charo`, email: 'cevoli.charo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Cevoli%20Charo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'raiantkd94',
        user: { id: 'u_padre_21', name: `Scmidtchen Carrasco Raian Roxana Millaray`, email: 'raiantkd94@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Scmidtchen%20Carrasco%20Raian%20Roxana%20Millaray&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'estacionballenera42',
        user: { id: 'u_padre_22', name: `Catalán Giaroli Luis Alberto`, email: 'estacionballenera42@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Catal%C3%A1n%20Giaroli%20Luis%20Alberto&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'catalan.scmidtchen.luis.octavio',
        user: { id: 'u_estudiante_11', name: `Catalán Scmidtchen Luis Octavio`, email: 'catalan.scmidtchen.luis.octavio@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Catal%C3%A1n%20Scmidtchen%20Luis%20Octavio&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'rocha.victorino',
        user: { id: 'u_estudiante_12', name: `Rocha Victorino`, email: 'rocha.victorino@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Rocha%20Victorino&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'melisadcuesta',
        user: { id: 'u_padre_23', name: `Cuesta Melisa Daniela`, email: 'melisadcuesta@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Cuesta%20Melisa%20Daniela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'gero_14',
        user: { id: 'u_padre_24', name: `Rodríguez Conte Grand Gerónimo`, email: 'gero_14@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Rodr%C3%ADguez%20Conte%20Grand%20Ger%C3%B3nimo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'rodriguez.cuesta.nazareno',
        user: { id: 'u_estudiante_13', name: `Rodriguez Cuesta Nazareno`, email: 'rodriguez.cuesta.nazareno@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Rodriguez%20Cuesta%20Nazareno&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'emmaromina155',
        user: { id: 'u_padre_25', name: `Melgarejo Emma Romina`, email: 'emmaromina155@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Melgarejo%20Emma%20Romina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'biasuttifederico',
        user: { id: 'u_padre_26', name: `Biasutti Federico Eduardo`, email: 'biasuttifederico@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Biasutti%20Federico%20Eduardo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'biasutti.ciro.eduardo',
        user: { id: 'u_estudiante_14', name: `Biasutti Ciro Eduardo`, email: 'biasutti.ciro.eduardo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Biasutti%20Ciro%20Eduardo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'cisneros.rinaldi.facundo',
        user: { id: 'u_estudiante_15', name: `Cisneros Rinaldi Facundo`, email: 'cisneros.rinaldi.facundo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Facundo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'marielacristal',
        user: { id: 'u_padre_27', name: `Cristaldo Mariela`, email: 'marielacristal@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Cristaldo%20Mariela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guille-eltucu',
        user: { id: 'u_padre_28', name: `Córdoba Guillermo Sebastián`, email: 'guille-eltucu@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Guillermo%20Sebasti%C3%A1n&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'cordoba.sol.fiorella',
        user: { id: 'u_estudiante_16', name: `Córdoba Sol Fiorella`, email: 'cordoba.sol.fiorella@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Sol%20Fiorella&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'virmangiapane',
        user: { id: 'u_padre_29', name: `Mangiapane Virginia`, email: 'virmangiapane@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mangiapane%20Virginia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'billydummig',
        user: { id: 'u_padre_30', name: `Dümmig Guillermo Federico`, email: 'billydummig@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=D%C3%BCmmig%20Guillermo%20Federico&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'dummig.clara',
        user: { id: 'u_estudiante_17', name: `Dümmig Clara`, email: 'dummig.clara@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=D%C3%BCmmig%20Clara&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guada1825',
        user: { id: 'u_padre_31', name: `Torres María Guadalupe`, email: 'guada1825@yahoo.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Torres%20Mar%C3%ADa%20Guadalupe&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'julisf40',
        user: { id: 'u_padre_32', name: `Fernández Julio`, email: 'julisf40@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Fern%C3%A1ndez%20Julio&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'fernandez.torres.juana',
        user: { id: 'u_estudiante_18', name: `Fernandez Torres Juana`, email: 'fernandez.torres.juana@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Fernandez%20Torres%20Juana&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'silvinainestorres',
        user: { id: 'u_padre_33', name: `Torres Silvina Ines`, email: 'silvinainestorres@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Torres%20Silvina%20Ines&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mangabale',
        user: { id: 'u_padre_34', name: `Manzi Gabriel Alejandro`, email: 'mangabale@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Manzi%20Gabriel%20Alejandro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'manzi.lautaro.andres',
        user: { id: 'u_estudiante_19', name: `Manzi Lautaro Andrés`, email: 'manzi.lautaro.andres@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Manzi%20Lautaro%20Andr%C3%A9s&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'pierattinimregina',
        user: { id: 'u_padre_35', name: `Pierattini Martínez Regina`, email: 'pierattinimregina@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Pierattini%20Mart%C3%ADnez%20Regina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'ostanelloleonardog',
        user: { id: 'u_padre_36', name: `Ostanello Leonardo`, email: 'ostanelloleonardog@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Ostanello%20Leonardo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'ostanello.pierattini.luna',
        user: { id: 'u_estudiante_20', name: `Ostanello Pierattini Luna`, email: 'ostanello.pierattini.luna@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Ostanello%20Pierattini%20Luna&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'alvarez.lola.milagros',
        user: { id: 'u_estudiante_21', name: `Álvarez Lola Milagros`, email: 'alvarez.lola.milagros@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Lola%20Milagros&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'anaymartinypedro',
        user: { id: 'u_padre_37', name: `Familia de Arriagada Breppe Enzo Luka`, email: 'anaymartinypedro@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Breppe%20Ana%20Carla&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'arriagada.breppe.enzo.luka',
        user: { id: 'u_estudiante_22', name: `Arriagada Breppe Enzo Luka`, email: 'arriagada.breppe.enzo.luka@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Arriagada%20Breppe%20Enzo%20Luka&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'flopavalen2',
        user: { id: 'u_padre_38', name: `Esteche Florencia Ayelen`, email: 'flopavalen2@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Esteche%20Florencia%20Ayelen&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'barrientosnicolas426',
        user: { id: 'u_padre_39', name: `Barrientos Claudio Nicolas`, email: 'barrientosnicolas426@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Barrientos%20Claudio%20Nicolas&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'barrientos.alejo',
        user: { id: 'u_estudiante_23', name: `Barrientos Alejo`, email: 'barrientos.alejo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Barrientos%20Alejo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'villagramalena7',
        user: { id: 'u_padre_40', name: `Villagra Malena Maite`, email: 'villagramalena7@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Villagra%20Malena%20Maite&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'cemanueld',
        user: { id: 'u_padre_41', name: `Díaz Claudio Emanuel`, email: 'cemanueld@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=D%C3%ADaz%20Claudio%20Emanuel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diaz.enzo.joaquin',
        user: { id: 'u_estudiante_24', name: `Díaz Enzo Joaquín`, email: 'diaz.enzo.joaquin@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=D%C3%ADaz%20Enzo%20Joaqu%C3%ADn&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'vasaro1312',
        user: { id: 'u_padre_42', name: `Asaro Verónica`, email: 'vasaro1312@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Asaro%20Ver%C3%B3nica&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'diegoevans',
        user: { id: 'u_padre_43', name: `Evans Diego`, email: 'diegoevans@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Evans%20Diego&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'evans.asaro.justina',
        user: { id: 'u_estudiante_25', name: `Evans Asaro Justina`, email: 'evans.asaro.justina@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Evans%20Asaro%20Justina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'amigraciav',
        user: { id: 'u_padre_44', name: `Amira Gracia Villalobos`, email: 'amigraciav@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Amira%20Gracia%20Villalobos&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'nicolasmarchesani',
        user: { id: 'u_padre_45', name: `Marchesani Nicolas`, email: 'nicolasmarchesani@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Marchesani%20Nicolas&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'marchesani.franccesca',
        user: { id: 'u_estudiante_26', name: `Marchesani Franccesca`, email: 'marchesani.franccesca@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Marchesani%20Franccesca&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'curanga',
        user: { id: 'u_padre_46', name: `Carlos Ignacio Marciano Uranga Castro`, email: 'curanga@live.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Carlos%20Ignacio%20Marciano%20Uranga%20Castro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'marciano.uranga.castro.sara',
        user: { id: 'u_estudiante_27', name: `Marciano Uranga Castro Sara`, email: 'marciano.uranga.castro.sara@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Marciano%20Uranga%20Castro%20Sara&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'paula621',
        user: { id: 'u_padre_47', name: `Pereyra Paula`, email: 'paula621@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Pereyra%20Paula&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mieresmaxi',
        user: { id: 'u_padre_48', name: `Mieres Maximiliano`, email: 'mieresmaxi@outlook.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mieres%20Maximiliano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mieres.martiniano',
        user: { id: 'u_estudiante_28', name: `Mieres Martiniano`, email: 'mieres.martiniano@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mieres%20Martiniano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'ruthviera_10',
        user: { id: 'u_padre_49', name: `Viera Ruth`, email: 'ruthviera_10@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Viera%20Ruth&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'gerardo.maximiliano.olmedo',
        user: { id: 'u_padre_50', name: `Olmedo Gerardo Maximiliano`, email: 'gerardo.maximiliano.olmedo@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Olmedo%20Gerardo%20Maximiliano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'olmedo.julieta',
        user: { id: 'u_estudiante_29', name: `Olmedo Julieta`, email: 'olmedo.julieta@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Olmedo%20Julieta&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'yesi.domingorena',
        user: { id: 'u_padre_51', name: `Yesica Yanina Domingorena`, email: 'yesi.domingorena@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Yesica%20Yanina%20Domingorena&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mgreimondez',
        user: { id: 'u_padre_52', name: `Martín Guillermo Reimondez`, email: 'mgreimondez@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mart%C3%ADn%20Guillermo%20Reimondez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'reimondez.oliver.luciano',
        user: { id: 'u_estudiante_30', name: `Reimondez Oliver Luciano`, email: 'reimondez.oliver.luciano@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Reimondez%20Oliver%20Luciano&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'montero.natalia.soledad',
        user: { id: 'u_padre_53', name: `Piedrabuena Montero Natalia Soledad`, email: 'montero.natalia.soledad@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Piedrabuena%20Montero%20Natalia%20Soledad&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'renericardodanielsalinas',
        user: { id: 'u_padre_54', name: `Salinas René Ricardo Daniel`, email: 'renericardodanielsalinas@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Salinas%20Ren%C3%A9%20Ricardo%20Daniel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'salinas.piedrabuena.francisco.rene',
        user: { id: 'u_estudiante_31', name: `Salinas Piedrabuena Francisco René`, email: 'salinas.piedrabuena.francisco.rene@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Salinas%20Piedrabuena%20Francisco%20Ren%C3%A9&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'natysegovia20',
        user: { id: 'u_padre_55', name: `Segovia Natalia`, email: 'natysegovia20@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Segovia%20Natalia&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guillermolopezservate',
        user: { id: 'u_padre_56', name: `Guillermo López Servate`, email: 'guillermolopezservate@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Guillermo%20L%C3%B3pez%20Servate&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'tomas.segovia.ian',
        user: { id: 'u_estudiante_32', name: `Tomás Segovia Ian`, email: 'tomas.segovia.ian@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Tom%C3%A1s%20Segovia%20Ian&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'magaliterraza1',
        user: { id: 'u_padre_57', name: `Terraza Magali`, email: 'magaliterraza1@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Terraza%20Magali&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'adrianvan08',
        user: { id: 'u_padre_58', name: `Van Autenboer Adrián Horacio`, email: 'adrianvan08@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Van%20Autenboer%20Adri%C3%A1n%20Horacio&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'van.autenboer.terraza.mae',
        user: { id: 'u_estudiante_33', name: `Van Autenboer Terraza Mae`, email: 'van.autenboer.terraza.mae@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Van%20Autenboer%20Terraza%20Mae&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'conchillosuyay',
        user: { id: 'u_padre_59', name: `Suyay Conchillo`, email: 'conchillosuyay@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Suyay%20Conchillo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'dveron678',
        user: { id: 'u_padre_60', name: `Diego Veron`, email: 'dveron678@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Diego%20Veron&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'veron.conchillo.blas',
        user: { id: 'u_estudiante_34', name: `Verón Conchillo Blas`, email: 'veron.conchillo.blas@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Ver%C3%B3n%20Conchillo%20Blas&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'faus_ti',
        user: { id: 'u_padre_61', name: `Familia de Altuna Filomena`, email: 'faus_ti@cloud.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Paez%20Candela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'altuna.filomena',
        user: { id: 'u_estudiante_35', name: `Altuna Filomena`, email: 'altuna.filomena@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Altuna%20Filomena&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mariel.walser',
        user: { id: 'u_padre_62', name: `Walser Mariel Ivonne`, email: 'mariel.walser@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Walser%20Mariel%20Ivonne&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'brianbengoa07',
        user: { id: 'u_padre_63', name: `Bengoa Brian Andrés`, email: 'brianbengoa07@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Bengoa%20Brian%20Andr%C3%A9s&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'bengoa.walser.emma',
        user: { id: 'u_estudiante_36', name: `Bengoa Walser Emma`, email: 'bengoa.walser.emma@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Bengoa%20Walser%20Emma&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'rominamoon1',
        user: { id: 'u_padre_64', name: `Méndez Romina Soledad`, email: 'rominamoon1@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=M%C3%A9ndez%20Romina%20Soledad&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'eboviez',
        user: { id: 'u_padre_65', name: `Boviez Edgardo Andrés`, email: 'eboviez@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Boviez%20Edgardo%20Andr%C3%A9s&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'boviez.mendez.felipe',
        user: { id: 'u_estudiante_37', name: `Boviez Méndez Felipe`, email: 'boviez.mendez.felipe@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Boviez%20M%C3%A9ndez%20Felipe&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'karilopezr24',
        user: { id: 'u_padre_66', name: `López Rueda Karina`, email: 'karilopezr24@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=L%C3%B3pez%20Rueda%20Karina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'maximobrendel',
        user: { id: 'u_padre_67', name: `Brendel Máximo`, email: 'maximobrendel@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Brendel%20M%C3%A1ximo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'brendel.lopez.matheo',
        user: { id: 'u_estudiante_38', name: `Brendel López Matheo`, email: 'brendel.lopez.matheo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Brendel%20L%C3%B3pez%20Matheo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'ailen.basualto',
        user: { id: 'u_padre_68', name: `Basualto Cobos Ailen Fernanda`, email: 'ailen.basualto@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Basualto%20Cobos%20Ailen%20Fernanda&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'guille28_82',
        user: { id: 'u_padre_69', name: `Coronel Félix Guillermo`, email: 'guille28_82@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Coronel%20F%C3%A9lix%20Guillermo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'coronel.emma',
        user: { id: 'u_estudiante_39', name: `Coronel Emma`, email: 'coronel.emma@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Coronel%20Emma&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'lncancelarich',
        user: { id: 'u_padre_70', name: `Cancelarich Lorena`, email: 'lncancelarich@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Cancelarich%20Lorena&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'jefuentesrios',
        user: { id: 'u_padre_71', name: `Fuentes Rios Javier`, email: 'jefuentesrios@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Fuentes%20Rios%20Javier&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'fuentes.cancelarich.vera',
        user: { id: 'u_estudiante_40', name: `Fuentes Cancelarich Vera`, email: 'fuentes.cancelarich.vera@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Fuentes%20Cancelarich%20Vera&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'danielaramirez1887',
        user: { id: 'u_padre_72', name: `Daniela Marite Ramirez`, email: 'danielaramirez1887@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Daniela%20Marite%20Ramirez&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'gonzalez.ramirez.alexis.gaston',
        user: { id: 'u_estudiante_41', name: `González Ramirez Alexis Gastón`, email: 'gonzalez.ramirez.alexis.gaston@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Gonz%C3%A1lez%20Ramirez%20Alexis%20Gast%C3%B3n&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'romiboloqui',
        user: { id: 'u_padre_73', name: `Boloqui Romina`, email: 'romiboloqui@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Boloqui%20Romina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'fmehrbald',
        user: { id: 'u_padre_74', name: `Mehrbald Facundo`, email: 'fmehrbald@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Mehrbald%20Facundo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'mehrbald.boloqui.victoria',
        user: { id: 'u_estudiante_42', name: `Mehrbald Boloqui Victoria`, email: 'mehrbald.boloqui.victoria@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Mehrbald%20Boloqui%20Victoria&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sabrinatristanpm',
        user: { id: 'u_padre_75', name: `Tristán Nidia Sabrina`, email: 'sabrinatristanpm@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Trist%C3%A1n%20Nidia%20Sabrina&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'estudiosaenz',
        user: { id: 'u_padre_76', name: `Sáenz Martín Damian`, email: 'estudiosaenz@hotmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=S%C3%A1enz%20Mart%C3%ADn%20Damian&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'saenz.ariana',
        user: { id: 'u_estudiante_43', name: `Saenz Ariana`, email: 'saenz.ariana@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=Saenz%20Ariana&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'noelas',
        user: { id: 'u_padre_77', name: `Sanchez Carnero Noela`, email: 'noelas@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Sanchez%20Carnero%20Noela&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'caminante109',
        user: { id: 'u_padre_78', name: `Fernandez Miranda Magaña Álvaro`, email: 'caminante109@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Fernandez%20Miranda%20Maga%C3%B1a%20%C3%81lvaro&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'sanchez.fernandez.miranda.xairo',
        user: { id: 'u_estudiante_44', name: `Sánchez Fernández Miranda Xairo`, email: 'sanchez.fernandez.miranda.xairo@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Fern%C3%A1ndez%20Miranda%20Xairo&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'ESTUDIANTE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'deboratorres1991',
        user: { id: 'u_padre_79', name: `Torres Débora`, email: 'deboratorres1991@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Torres%20D%C3%A9bora&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'metortola',
        user: { id: 'u_padre_80', name: `Tortola Martín Ezequiel`, email: 'metortola@gmail.com', role: 'PADRE', avatar: 'https://ui-avatars.com/api/?name=Tortola%20Mart%C3%ADn%20Ezequiel&background=random' },
        institutions: [{ institutionId: 'inst-vinculos', institutionName: 'Vínculos de Libertad', institutionSlug: 'vinculos-de-libertad', role: 'PADRE' as any, primaryColor: '#0ea5e9', secondaryColor: '#0369a1' }]
    },
    {
        emailPattern: 'tortola.torres.sofia',
        user: { id: 'u_estudiante_45', name: `Tórtola Torres Sofía`, email: 'tortola.torres.sofia@alumnos.vinculos.edu', role: 'ESTUDIANTE', avatar: 'https://ui-avatars.com/api/?name=T%C3%B3rtola%20Torres%20Sof%C3%ADa&background=random' },
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
    getMe: async (token: string): Promise<User> => {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Sesión expirada o inválida');
        const data = await response.json();
        return {
            id: data.id || 'unknown',
            name: data.full_name || data.name || 'Usuario',
            email: data.email,
            role: data.role || 'ESTUDIANTE',
            avatar: data.avatar,
            requiresPasswordChange: data.requiresPasswordChange || data.requires_password_change || false,
            institutions: data.institutions || [],
        };
    },
    login: async (email: string, _password: string): Promise<{ user: User; token: string }> => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: _password }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Credenciales inválidas');
        }

        const data = await response.json();

        const user: User = {
            id: data.user?.id || 'unknown',
            name: data.user?.full_name || data.user?.name || 'Usuario',
            email: data.user?.email || email,
            role: data.user?.role || 'ESTUDIANTE',
            avatar: data.user?.avatar,
            requiresPasswordChange: data.user?.requiresPasswordChange || false,
            institutions: data.user?.institutions || [],
        };

        return {
            user,
            token: data.access_token || data.token,
        };
    },
    setInitialPassword: async (userId: string, newPassword: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${API_BASE}/auth/set-initial-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, newPassword }),
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || 'Error cambiando la contraseña');
        }
        return { success: true };
    }
};

// ── Institutions API ──────────────────────────────────────────

export const institutionsApi = {
    getAll: async (token: string): Promise<UserInstitution[]> => {
        const response = await fetch(`${API_BASE}/institutions/my`, {
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
            role: inst.role, // the role is now coming from the backend endpoint
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
        const response = await fetch(`${API_BASE}/users?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching users');
        const data = await response.json();
        return data || [];
    },

    create: async (data: Partial<User>, institutionId: string, token: string): Promise<User> => {
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
    },

    update: async (userId: string, data: Partial<User>, token: string): Promise<User> => {
        const response = await fetch(`${API_BASE}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error updating user');
        return await response.json();
    },

    resetPassword: async (userId: string, token: string): Promise<{ success: boolean; message: string }> => {
        const response = await fetch(`${API_BASE}/users/${userId}/reset-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error resetting password');
        return await response.json();
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

export const communicationsApi = {
    getAll: async (institutionId: string, token: string): Promise<Communication[]> => {
        const response = await fetch(`${API_BASE}/communications?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching communications');
        return response.json();
    },
    create: async (
        data: { type: Communication['type']; title: string; content: string; recipientId?: string | null; courseId?: string | null },
        institutionId: string,
        token: string,
    ): Promise<Communication> => {
        const response = await fetch(`${API_BASE}/communications?institutionId=${institutionId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error creating communication');
        return response.json();
    },
    markAsRead: async (institutionId: string, token: string): Promise<void> => {
        const response = await fetch(`${API_BASE}/communications/read?institutionId=${institutionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error marking communications as read');
    }
};

export const aulasApi = {
    getAll: async (institutionId: string, token: string): Promise<Aula[]> => {
        const response = await fetch(`${API_BASE}/classrooms?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching aulas');
        return response.json();
    },
    create: async (
        data: { name: string; color?: string; capacity?: number; teachers?: string[] },
        institutionId: string,
        token: string,
    ): Promise<Aula> => {
        const response = await fetch(`${API_BASE}/classrooms?institutionId=${institutionId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error creating aula');
        return response.json();
    },
    update: async (
        aulaId: string,
        data: { name?: string; color?: string; capacity?: number; teachers?: string[] },
        institutionId: string,
        token: string,
    ): Promise<Aula> => {
        const response = await fetch(`${API_BASE}/classrooms/${aulaId}?institutionId=${institutionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error updating aula');
        return response.json();
    },
    remove: async (aulaId: string, institutionId: string, token: string): Promise<void> => {
        const response = await fetch(`${API_BASE}/classrooms/${aulaId}?institutionId=${institutionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error('Error deleting aula');
    },
};

export const ninosApi = {
    getAll: async (institutionId: string, token: string): Promise<Nino[]> => {
        const response = await fetch(`${API_BASE}/children?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching ninos');
        return response.json();
    },
    create: async (
        data: {
            name: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId: string;
            parentIds: string[];
            attendanceRate?: number;
        },
        institutionId: string,
        token: string,
    ): Promise<Nino> => {
        const response = await fetch(`${API_BASE}/children?institutionId=${institutionId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error creating nino');
        return response.json();
    },
    update: async (
        ninoId: string,
        data: {
            name?: string;
            gender?: 'MASCULINO' | 'FEMENINO';
            birthDate?: string;
            allergies?: string[];
            avatar?: string;
            aulaId?: string;
            parentIds?: string[];
            attendanceRate?: number;
        },
        institutionId: string,
        token: string,
    ): Promise<Nino> => {
        const response = await fetch(`${API_BASE}/children/${ninoId}?institutionId=${institutionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error updating nino');
        return response.json();
    },
};

export const eventsApi = {
    getAll: async (institutionId: string, token: string): Promise<CalendarEvent[]> => {
        const response = await fetch(`${API_BASE}/events?institutionId=${institutionId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching events');
        const data = await response.json();

        return (data || []).map((event: any) => ({
            ...event,
            start: event.start ? new Date(event.start) : event.start,
            end: event.end ? new Date(event.end) : event.end,
        }));
    },
    create: async (data: Partial<CalendarEvent>, institutionId: string, token: string): Promise<CalendarEvent> => {
        const response = await fetch(`${API_BASE}/events?institutionId=${institutionId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error creating event');
        const event = await response.json();
        return {
            ...event,
            start: event.start ? new Date(event.start) : event.start,
            end: event.end ? new Date(event.end) : event.end,
        };
    },
    update: async (eventId: string, data: Partial<CalendarEvent>, institutionId: string, token: string): Promise<CalendarEvent> => {
        const response = await fetch(`${API_BASE}/events/${eventId}?institutionId=${institutionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error updating event');
        const event = await response.json();
        return {
            ...event,
            start: event.start ? new Date(event.start) : event.start,
            end: event.end ? new Date(event.end) : event.end,
        };
    },
    remove: async (eventId: string, institutionId: string, token: string): Promise<void> => {
        const response = await fetch(`${API_BASE}/events/${eventId}?institutionId=${institutionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error deleting event');
    }
};

// ── Messages API ──────────────────────────────────────────────

// --- Utilities for cross-tab mock sync ---

export const messagesApi = {
    getMessages: async (_userId: string, targetUserId: string, token: string): Promise<Message[]> => {
        const response = await fetch(`${API_BASE}/messages/${targetUserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error fetching messages');
        return response.json();
    },

    sendMessage: async (_senderId: string, recipientId: string, content: string, token: string, file?: Message['file']): Promise<Message> => {
        const response = await fetch(`${API_BASE}/messages/${recipientId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content, file })
        });
        if (!response.ok) throw new Error('Error sending message');
        return response.json();
    },

    getConversations: async (_userId: string, token: string): Promise<{ contactId: string, lastMessage: Message, unreadCount: number }[]> => {
        const response = await fetch(`${API_BASE}/messages/conversations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error fetching conversations');
        return response.json();
    },

    markAsRead: async (_userId: string, targetUserId: string, token: string): Promise<void> => {
        const response = await fetch(`${API_BASE}/messages/${targetUserId}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error marking messages as read');
    }
};

// ── Reports API ───────────────────────────────────────────────

export const reportsApi = {
    create: async (studentId: string, title: string, content: string, token: string): Promise<{ message: string, report: AcademicReport }> => {
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
    },
    getByStudent: async (studentId: string, token: string): Promise<AcademicReport[]> => {
        const response = await fetch(`${API_BASE}/reports/student/${studentId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar informes');
        return response.json();
    }
};
