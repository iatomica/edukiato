/**
 * Mock Data — Institution-Scoped
 *
 * All entities carry an `institutionId` so the useTenantData hook
 * can filter down to only the active institution's data.
 *
 * Two institutions:
 *   inst-001 → Instituto de Arte Contemporáneo  (music focus)
 *   inst-002 → Escuela de Música Moderna        (modern music focus)
 */

import { Course, Student, CalendarEvent, FeedItem, Conversation, Message, Notification, Communication, UserRole, Aula, Nino, Payment } from '../types';

// ── Institution IDs ──────────────────────────────────────────

export const INST_VINCULOS = 'inst-vinculos';

export const MOCK_COURSES: Course[] = [];

export const MOCK_AULAS: Aula[] = [
  {
    "id": "aula_anidar",
    "institutionId": "inst-vinculos",
    "name": "Alvaro Sosa Lopez",
    "capacity": 15,
    "teachers": [
      "u_staff_4"
    ],
    "assistants": [
      "u_staff_5"
    ],
    "color": "bg-rose-100 text-rose-700 border-rose-200"
  },
  {
    "id": "aula_raiz",
    "institutionId": "inst-vinculos",
    "name": "Lucia Molina Castro",
    "capacity": 20,
    "teachers": [
      "u_staff_8"
    ],
    "assistants": [
      "u_staff_5"
    ],
    "color": "bg-amber-100 text-amber-700 border-amber-200"
  },
  {
    "id": "aula_libertad",
    "institutionId": "inst-vinculos",
    "name": "Carlos Alvarez Lopez",
    "capacity": 20,
    "teachers": [
      "u_staff_2"
    ],
    "assistants": [],
    "color": "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    "id": "aula_cielo",
    "institutionId": "inst-vinculos",
    "name": "Lucia Martinez Lopez",
    "capacity": 25,
    "teachers": [
      "u_staff_7"
    ],
    "assistants": [],
    "color": "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    "id": "aula_vuelo",
    "institutionId": "inst-vinculos",
    "name": "Carlos Gimenez Vazquez",
    "capacity": 25,
    "teachers": [
      "u_staff_6"
    ],
    "assistants": [],
    "color": "bg-indigo-100 text-indigo-700 border-indigo-200"
  }
];

export const MOCK_NINOS: Nino[] = [
  {
    "id": "u_estudiante_0",
    "institutionId": "inst-vinculos",
    "name": "Martina Ruiz Garcia",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_0",
      "u_padre_1"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alvaro%20Sosa%20Lopez&background=random",
    "birthDate": "2025-02-20",
    "dni": "70216396",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_1",
    "institutionId": "inst-vinculos",
    "name": "Camila Castro Castro",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_2",
      "u_padre_3"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Castro%20Castro&background=random",
    "birthDate": "2025-05-02",
    "dni": "70417837",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_2",
    "institutionId": "inst-vinculos",
    "name": "Camila Martinez Perez",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_4",
      "u_padre_5"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Martinez%20Perez&background=random",
    "birthDate": "2024-09-10",
    "dni": "70216294",
    "attendanceRate": 85
  },
  {
    "id": "u_estudiante_3",
    "institutionId": "inst-vinculos",
    "name": "Mateo Vazquez Alvarez",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_6",
      "u_padre_7"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mateo%20Vazquez%20Alvarez&background=random",
    "birthDate": "2025-01-24",
    "dni": "70416978",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_4",
    "institutionId": "inst-vinculos",
    "name": "Valentina Torres Martinez",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_staff_2",
      "u_padre_8"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Valentina%20Torres%20Martinez&background=random",
    "birthDate": "2025-01-15",
    "dni": "70216376",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_5",
    "institutionId": "inst-vinculos",
    "name": "Lucas Sanchez Gomez",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_9",
      "u_padre_10"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Lucas%20Sanchez%20Gomez&background=random",
    "birthDate": "2025-03-20",
    "dni": "70417823",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_6",
    "institutionId": "inst-vinculos",
    "name": "Mateo Ramos Garcia",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_11",
      "u_padre_12"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mateo%20Ramos%20Garcia&background=random",
    "birthDate": "2025-02-12",
    "dni": "70216392",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_7",
    "institutionId": "inst-vinculos",
    "name": "Emma Romero Castro",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_13",
      "u_padre_14"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Emma%20Romero%20Castro&background=random",
    "birthDate": "2025-09-18",
    "dni": "70593200",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_8",
    "institutionId": "inst-vinculos",
    "name": "Camila Ramos Martinez",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_15",
      "u_padre_16"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Ramos%20Martinez&background=random",
    "birthDate": "2024-12-16",
    "dni": "70576468",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_9",
    "institutionId": "inst-vinculos",
    "name": "Alejandro Alvarez Perez",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_17",
      "u_padre_18"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alejandro%20Alvarez%20Perez&background=random",
    "birthDate": "2023-09-27",
    "dni": "59904799",
    "attendanceRate": 88
  },
  {
    "id": "u_estudiante_10",
    "institutionId": "inst-vinculos",
    "name": "Valeria Molina Ruiz",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_19",
      "u_padre_20"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Valeria%20Molina%20Ruiz&background=random",
    "birthDate": "2023-09-25",
    "dni": "59904962",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_11",
    "institutionId": "inst-vinculos",
    "name": "Julia Castro Perez",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_21",
      "u_padre_22"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Julia%20Castro%20Perez&background=random",
    "birthDate": "2024-01-05",
    "dni": "59905041",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_12",
    "institutionId": "inst-vinculos",
    "name": "Diego Gimenez Torres",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_11",
      "u_padre_12"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Diego%20Gimenez%20Torres&background=random",
    "birthDate": "2023-08-25",
    "dni": "59904954",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_13",
    "institutionId": "inst-vinculos",
    "name": "Mia Alvarez Ruiz",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_23",
      "u_padre_24"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mia%20Alvarez%20Ruiz&background=random",
    "birthDate": "2024-03-15",
    "dni": "59905078",
    "attendanceRate": 94
  },
  {
    "id": "u_estudiante_14",
    "institutionId": "inst-vinculos",
    "name": "Camila Romero Perez",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_25",
      "u_padre_26"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Romero%20Perez&background=random",
    "birthDate": "2023-01-11",
    "dni": "59630375",
    "attendanceRate": 84
  },
  {
    "id": "u_estudiante_15",
    "institutionId": "inst-vinculos",
    "name": "Camila Lopez Diaz",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_4",
      "u_padre_5"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Lopez%20Diaz&background=random",
    "birthDate": "2022-09-08",
    "dni": "59289270",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_16",
    "institutionId": "inst-vinculos",
    "name": "Daniel Gomez Diaz",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_27",
      "u_padre_28"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Daniel%20Gomez%20Diaz&background=random",
    "birthDate": "2022-09-26",
    "dni": "59289293",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_17",
    "institutionId": "inst-vinculos",
    "name": "Mateo Sanchez Sanchez",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_29",
      "u_padre_30"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mateo%20Sanchez%20Sanchez&background=random",
    "birthDate": "2022-08-17",
    "dni": "59289258",
    "attendanceRate": 95
  },
  {
    "id": "u_estudiante_18",
    "institutionId": "inst-vinculos",
    "name": "Sofia Fernandez Alvarez",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_31",
      "u_padre_32"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Sofia%20Fernandez%20Alvarez&background=random",
    "birthDate": "2023-05-02",
    "dni": "59538319",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_19",
    "institutionId": "inst-vinculos",
    "name": "Carlos Lopez Gomez",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_33",
      "u_padre_34"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Carlos%20Lopez%20Gomez&background=random",
    "birthDate": "2022-12-09",
    "dni": "59538855",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_20",
    "institutionId": "inst-vinculos",
    "name": "Valeria Ramos Gomez",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_35",
      "u_padre_36"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Valeria%20Ramos%20Gomez&background=random",
    "birthDate": "2022-09-26",
    "dni": "59289259",
    "attendanceRate": 95
  },
  {
    "id": "u_estudiante_21",
    "institutionId": "inst-vinculos",
    "name": "Sofia Gimenez Molina",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_0",
      "u_padre_1"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Sofia%20Gimenez%20Molina&background=random",
    "birthDate": "2022-05-30",
    "dni": "59289187",
    "attendanceRate": 85
  },
  {
    "id": "u_estudiante_22",
    "institutionId": "inst-vinculos",
    "name": "Sofia Arias Molina",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_37"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Sofia%20Arias%20Molina&background=random",
    "birthDate": "2022-06-06",
    "dni": "59289193",
    "attendanceRate": 88
  },
  {
    "id": "u_estudiante_23",
    "institutionId": "inst-vinculos",
    "name": "Julia Ruiz Garcia",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_38",
      "u_padre_39"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Julia%20Ruiz%20Garcia&background=random",
    "birthDate": "2022-03-14",
    "dni": "59246548",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_24",
    "institutionId": "inst-vinculos",
    "name": "Daniel Arias Torres",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_40",
      "u_padre_41"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Daniel%20Arias%20Torres&background=random",
    "birthDate": "2022-06-23",
    "dni": "59289200",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_25",
    "institutionId": "inst-vinculos",
    "name": "Mateo Garcia Vazquez",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_42",
      "u_padre_43"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mateo%20Garcia%20Vazquez&background=random",
    "birthDate": "2022-06-10",
    "dni": "59289192",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_26",
    "institutionId": "inst-vinculos",
    "name": "Hugo Ramos Gomez",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_44",
      "u_padre_45"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Hugo%20Ramos%20Gomez&background=random",
    "birthDate": "2021-07-22",
    "dni": "58987315",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_27",
    "institutionId": "inst-vinculos",
    "name": "Diego Alvarez Molina",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_staff_10",
      "u_padre_46"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Diego%20Alvarez%20Molina&background=random",
    "birthDate": "2021-12-29",
    "dni": "59125836",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_28",
    "institutionId": "inst-vinculos",
    "name": "Lucia Diaz Alvarez",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_47",
      "u_padre_48"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Lucia%20Diaz%20Alvarez&background=random",
    "birthDate": "2021-10-20",
    "dni": "58913759",
    "attendanceRate": 94
  },
  {
    "id": "u_estudiante_29",
    "institutionId": "inst-vinculos",
    "name": "Lucia Ruiz Garcia",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_49",
      "u_padre_50"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Lucia%20Ruiz%20Garcia&background=random",
    "birthDate": "2022-06-20",
    "dni": "59289203",
    "attendanceRate": 93
  },
  {
    "id": "u_estudiante_30",
    "institutionId": "inst-vinculos",
    "name": "Valentina Romero Garcia",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_51",
      "u_padre_52"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Valentina%20Romero%20Garcia&background=random",
    "birthDate": "2022-05-11",
    "dni": "59289166",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_31",
    "institutionId": "inst-vinculos",
    "name": "Laura Vazquez Sosa",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_53",
      "u_padre_54"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Laura%20Vazquez%20Sosa&background=random",
    "birthDate": "2022-04-18",
    "dni": "59336409",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_32",
    "institutionId": "inst-vinculos",
    "name": "Alejandro Castro Ruiz",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_55",
      "u_padre_56"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alejandro%20Castro%20Ruiz&background=random",
    "birthDate": "2022-05-19",
    "dni": "59289179",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_33",
    "institutionId": "inst-vinculos",
    "name": "Sofia Ruiz Ruiz",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_57",
      "u_padre_58"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Sofia%20Ruiz%20Ruiz&background=random",
    "birthDate": "2021-07-27",
    "dni": "58543268",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_34",
    "institutionId": "inst-vinculos",
    "name": "Julia Ruiz Molina",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_59",
      "u_padre_60"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Julia%20Ruiz%20Molina&background=random",
    "birthDate": "2022-02-25",
    "dni": "58913884",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_35",
    "institutionId": "inst-vinculos",
    "name": "Daniel Fernandez Lopez",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_61"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Daniel%20Fernandez%20Lopez&background=random",
    "birthDate": "2020-11-11",
    "dni": "58544763",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_36",
    "institutionId": "inst-vinculos",
    "name": "Lucas Arias Fernandez",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_62",
      "u_padre_63"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Lucas%20Arias%20Fernandez&background=random",
    "birthDate": "2020-07-29",
    "dni": "58337890",
    "attendanceRate": 90
  },
  {
    "id": "u_estudiante_37",
    "institutionId": "inst-vinculos",
    "name": "Alvaro Romero Rodriguez",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_64",
      "u_padre_65"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alvaro%20Romero%20Rodriguez&background=random",
    "birthDate": "2021-06-23",
    "dni": "58543225",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_38",
    "institutionId": "inst-vinculos",
    "name": "Alvaro Rodriguez Sosa",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_66",
      "u_padre_67"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alvaro%20Rodriguez%20Sosa&background=random",
    "birthDate": "2020-09-16",
    "dni": "58337941",
    "attendanceRate": 92
  },
  {
    "id": "u_estudiante_39",
    "institutionId": "inst-vinculos",
    "name": "Mateo Molina Romero",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_68",
      "u_padre_69"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mateo%20Molina%20Romero&background=random",
    "birthDate": "2021-05-24",
    "dni": "58545158",
    "attendanceRate": 89
  },
  {
    "id": "u_estudiante_40",
    "institutionId": "inst-vinculos",
    "name": "Diego Fernandez Fernandez",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_70",
      "u_padre_71"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Diego%20Fernandez%20Fernandez&background=random",
    "birthDate": "2020-07-28",
    "dni": "58337685",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_41",
    "institutionId": "inst-vinculos",
    "name": "Alejandro Diaz Diaz",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_72"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alejandro%20Diaz%20Diaz&background=random",
    "birthDate": "2020-08-21",
    "dni": "58243326",
    "attendanceRate": 99
  },
  {
    "id": "u_estudiante_42",
    "institutionId": "inst-vinculos",
    "name": "Laura Romero Castro",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_73",
      "u_padre_74"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Laura%20Romero%20Castro&background=random",
    "birthDate": "2021-01-06",
    "dni": "58543074",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_43",
    "institutionId": "inst-vinculos",
    "name": "Alvaro Sanchez Molina",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_75",
      "u_padre_76"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alvaro%20Sanchez%20Molina&background=random",
    "birthDate": "2021-03-05",
    "dni": "58543111",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_44",
    "institutionId": "inst-vinculos",
    "name": "Camila Vazquez Diaz",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_77",
      "u_padre_78"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Camila%20Vazquez%20Diaz&background=random",
    "birthDate": "2021-02-17",
    "dni": "58711210",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_45",
    "institutionId": "inst-vinculos",
    "name": "Alejandro Alvarez Vazquez",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_79",
      "u_padre_80"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Alejandro%20Alvarez%20Vazquez&background=random",
    "birthDate": "2020-09-12",
    "dni": "58337939",
    "attendanceRate": 93
  }
];
export const MOCK_STUDENTS: Student[] = [];
export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 'e_vinculos',
    institutionId: INST_VINCULOS,
    title: 'Acto Patrio',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
    type: 'ACTOS',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    creatorId: 'u_staff_3',
    description: 'Acto general con participación de todas las salas.',
    sharedWith: { scope: 'ALL' }
  },
  {
    id: 'e_vinculos_2',
    institutionId: INST_VINCULOS,
    title: 'Reunión de Padres',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    type: 'REUNION_DE_SALA',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    creatorId: 'u_staff_3',
    description: 'Reunión informativa de avance grupal.',
    sharedWith: { scope: 'ALL' }
  },
  {
    id: 'e_vinculos_3',
    institutionId: INST_VINCULOS,
    title: 'Taller de Arte',
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: 'EVENTOS_ESPECIALES',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    creatorId: 'u_staff_2',
    description: 'Taller especial de plástica para los alumnos.',
    sharedWith: { scope: 'AULA', targetIds: ['aula_libertad'] }
  }
];

export const MOCK_FEED: FeedItem[] = [
  {
    id: 'f1', institutionId: INST_VINCULOS, courseId: 'c_pickler', type: 'MATERIAL', scope: 'COURSE',
    title: 'PDF: Metodología Pickler Básica',
    description: 'Material de lectura obligatoria.',
    postedAt: new Date(), author: 'Seila Ayala',
    materialType: 'PDF', url: '#'
  },
  {
    id: 'f2', institutionId: INST_VINCULOS, courseId: 'c_pickler', type: 'MATERIAL', scope: 'COURSE',
    title: 'Video Introductorio',
    description: 'Enlace a YouTube con la charla inicial.',
    postedAt: new Date(Date.now() - 3600000), author: 'Romina Ayala',
    materialType: 'LINK', url: 'https://youtube.com'
  },
  {
    id: 'f3', institutionId: INST_VINCULOS, type: 'ANNOUNCEMENT', scope: 'INSTITUTION',
    title: 'Nuevos Recursos de Biblioteca',
    description: 'Se han incorporado nuevos recursos para la sala de juegos.',
    postedAt: new Date(), author: 'Lorena Mori'
  }
];

const storedNotifications = typeof window !== 'undefined' ? localStorage.getItem('MOCK_NOTIFICATIONS') : null;
export const MOCK_NOTIFICATIONS: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [
  { id: 'n1', institutionId: INST_VINCULOS, userId: 'julia.ramos.lopez@demo.edu', title: 'Aviso del Sistema', message: 'Bienvenida al panel Demo.', type: 'SYSTEM', isRead: false, time: new Date().toISOString() },
  { id: 'n2', institutionId: INST_VINCULOS, userId: 'martina.gimenez.ramos@demo.edu', title: 'Nueva Tarea Asignada', message: 'Revisar inscripciones.', type: 'SYSTEM', isRead: false, time: new Date().toISOString() }
];
export const MOCK_CONVERSATIONS: Conversation[] = [];
const storedMessages = typeof window !== 'undefined' ? localStorage.getItem('MOCK_MESSAGES') : null;
export const MOCK_MESSAGES: Record<string, Message[]> = storedMessages ? JSON.parse(storedMessages) : {};
export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', institutionId: INST_VINCULOS, studentId: 'u_estudiante_0', amount: 15000, status: 'PAID', dueDate: new Date(), date: new Date(), description: 'Cuota Marzo' },
  { id: 'p2', institutionId: INST_VINCULOS, studentId: 'u_estudiante_0', amount: 15000, status: 'PENDING', dueDate: new Date(Date.now() + 86400000 * 15), date: new Date(), description: 'Cuota Abril' },
  { id: 'p3', institutionId: INST_VINCULOS, studentId: 'u_estudiante_1', amount: 15000, status: 'PAID', dueDate: new Date(), date: new Date(), description: 'Cuota Marzo' }
];

export const MOCK_REVENUE_DATA: Record<string, Array<{ name: string; value: number }>> = {
  [INST_VINCULOS]: [
    { name: 'Sala Anidar', value: 50 },
    { name: 'Sala Libertad', value: 60 },
  ],
};

export const MOCK_ATTENDANCE_DATA: Record<string, Array<{ name: string; value: number; fill: string }>> = {
  [INST_VINCULOS]: [
    { name: 'Presente', value: 95, fill: '#10b981' },
    { name: 'Ausente', value: 5, fill: '#f43f5e' },
  ]
};

const storedCommunications = typeof window !== 'undefined' ? localStorage.getItem('MOCK_COMMUNICATIONS') : null;
export const MOCK_COMMUNICATIONS: Communication[] = storedCommunications ? JSON.parse(storedCommunications) : [
  {
    id: 'comm_vinculos_1',
    institutionId: INST_VINCULOS,
    type: 'ANUNCIO_GENERAL',
    title: 'Bienvenida al nuevo ciclo',
    content: 'Les damos una cálida bienvenida a todas las familias.',
    senderId: 'u_staff_3',
    senderName: 'Directora',
    createdAt: new Date().toISOString(),
    isRead: true,
  }
];

