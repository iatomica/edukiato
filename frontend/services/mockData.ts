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
    "name": "Sala Anidar (45 días a 2 años)",
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
    "name": "Sala Raíz (2 años)",
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
    "name": "Sala Libertad (3 años)",
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
    "name": "Sala Cielo (4 años)",
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
    "name": "Sala Vuelo (5 años)",
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
    "name": "Álvarez Nina",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_0",
      "u_padre_1"
    ],
    "avatar": "https://ui-avatars.com/api/?name=%C3%81lvarez%20Nina&background=random",
    "birthDate": "2025-02-20",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_1",
    "institutionId": "inst-vinculos",
    "name": "Battini Lamarque Manuel",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_2",
      "u_padre_3"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Battini%20Lamarque%20Manuel&background=random",
    "birthDate": "2025-05-02",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_2",
    "institutionId": "inst-vinculos",
    "name": "Cisneros Rinaldi Anna",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_4",
      "u_padre_5"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Anna&background=random",
    "birthDate": "2024-09-10",
    "attendanceRate": 85
  },
  {
    "id": "u_estudiante_3",
    "institutionId": "inst-vinculos",
    "name": "Espinosa San Román Alaia",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_6",
      "u_padre_7"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Espinosa%20San%20Rom%C3%A1n%20Alaia&background=random",
    "birthDate": "2025-01-24",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_4",
    "institutionId": "inst-vinculos",
    "name": "Hughes Sotelo Lisandro",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_staff_2",
      "u_padre_8"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Hughes%20Sotelo%20Lisandro&background=random",
    "birthDate": "2025-01-15",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_5",
    "institutionId": "inst-vinculos",
    "name": "Moreno Pérsico Valentín",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_9",
      "u_padre_10"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Moreno%20P%C3%A9rsico%20Valent%C3%ADn&background=random",
    "birthDate": "2025-03-20",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_6",
    "institutionId": "inst-vinculos",
    "name": "Rocha Bruno",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_11",
      "u_padre_12"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Rocha%20Bruno&background=random",
    "birthDate": "2025-02-12",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_7",
    "institutionId": "inst-vinculos",
    "name": "Sánchez Felipe",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_13",
      "u_padre_14"
    ],
    "avatar": "https://ui-avatars.com/api/?name=S%C3%A1nchez%20Felipe&background=random",
    "birthDate": "2025-09-18",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_8",
    "institutionId": "inst-vinculos",
    "name": "Segatti Suarez Stefano",
    "aulaId": "aula_anidar",
    "parentIds": [
      "u_padre_15",
      "u_padre_16"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Segatti%20Suarez%20Stefano&background=random",
    "birthDate": "2024-12-16",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_9",
    "institutionId": "inst-vinculos",
    "name": "Bogado Ríos Coco",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_17",
      "u_padre_18"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Bogado%20R%C3%ADos%20Coco&background=random",
    "birthDate": "2023-09-27",
    "attendanceRate": 88
  },
  {
    "id": "u_estudiante_10",
    "institutionId": "inst-vinculos",
    "name": "Cevoli Charo",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_19",
      "u_padre_20"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Cevoli%20Charo&background=random",
    "birthDate": "2023-09-25",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_11",
    "institutionId": "inst-vinculos",
    "name": "Catalán Scmidtchen Luis Octavio",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_21",
      "u_padre_22"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Catal%C3%A1n%20Scmidtchen%20Luis%20Octavio&background=random",
    "birthDate": "2024-01-05",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_12",
    "institutionId": "inst-vinculos",
    "name": "Rocha Victorino",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_11",
      "u_padre_12"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Rocha%20Victorino&background=random",
    "birthDate": "2023-08-25",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_13",
    "institutionId": "inst-vinculos",
    "name": "Rodriguez Cuesta Nazareno",
    "aulaId": "aula_raiz",
    "parentIds": [
      "u_padre_23",
      "u_padre_24"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Rodriguez%20Cuesta%20Nazareno&background=random",
    "birthDate": "2024-03-15",
    "attendanceRate": 94
  },
  {
    "id": "u_estudiante_14",
    "institutionId": "inst-vinculos",
    "name": "Biasutti Ciro Eduardo",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_25",
      "u_padre_26"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Biasutti%20Ciro%20Eduardo&background=random",
    "birthDate": "2023-01-11",
    "attendanceRate": 84
  },
  {
    "id": "u_estudiante_15",
    "institutionId": "inst-vinculos",
    "name": "Cisneros Rinaldi Facundo",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_4",
      "u_padre_5"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Facundo&background=random",
    "birthDate": "2022-09-08",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_16",
    "institutionId": "inst-vinculos",
    "name": "Córdoba Sol Fiorella",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_27",
      "u_padre_28"
    ],
    "avatar": "https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Sol%20Fiorella&background=random",
    "birthDate": "2022-09-26",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_17",
    "institutionId": "inst-vinculos",
    "name": "Dümmig Clara",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_29",
      "u_padre_30"
    ],
    "avatar": "https://ui-avatars.com/api/?name=D%C3%BCmmig%20Clara&background=random",
    "birthDate": "2022-08-17",
    "attendanceRate": 95
  },
  {
    "id": "u_estudiante_18",
    "institutionId": "inst-vinculos",
    "name": "Fernandez Torres Juana",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_31",
      "u_padre_32"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Fernandez%20Torres%20Juana&background=random",
    "birthDate": "2023-05-02",
    "attendanceRate": 86
  },
  {
    "id": "u_estudiante_19",
    "institutionId": "inst-vinculos",
    "name": "Manzi Lautaro Andrés",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_33",
      "u_padre_34"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Manzi%20Lautaro%20Andr%C3%A9s&background=random",
    "birthDate": "2022-12-09",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_20",
    "institutionId": "inst-vinculos",
    "name": "Ostanello Pierattini Luna",
    "aulaId": "aula_libertad",
    "parentIds": [
      "u_padre_35",
      "u_padre_36"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Ostanello%20Pierattini%20Luna&background=random",
    "birthDate": "2022-09-26",
    "attendanceRate": 95
  },
  {
    "id": "u_estudiante_21",
    "institutionId": "inst-vinculos",
    "name": "Álvarez Lola Milagros",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_0",
      "u_padre_1"
    ],
    "avatar": "https://ui-avatars.com/api/?name=%C3%81lvarez%20Lola%20Milagros&background=random",
    "birthDate": "2022-05-30",
    "attendanceRate": 85
  },
  {
    "id": "u_estudiante_22",
    "institutionId": "inst-vinculos",
    "name": "Arriagada Breppe Enzo Luka",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_37"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Arriagada%20Breppe%20Enzo%20Luka&background=random",
    "birthDate": "2022-06-06",
    "attendanceRate": 88
  },
  {
    "id": "u_estudiante_23",
    "institutionId": "inst-vinculos",
    "name": "Barrientos Alejo",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_38",
      "u_padre_39"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Barrientos%20Alejo&background=random",
    "birthDate": "2022-03-14",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_24",
    "institutionId": "inst-vinculos",
    "name": "Díaz Enzo Joaquín",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_40",
      "u_padre_41"
    ],
    "avatar": "https://ui-avatars.com/api/?name=D%C3%ADaz%20Enzo%20Joaqu%C3%ADn&background=random",
    "birthDate": "2022-06-23",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_25",
    "institutionId": "inst-vinculos",
    "name": "Evans Asaro Justina",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_42",
      "u_padre_43"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Evans%20Asaro%20Justina&background=random",
    "birthDate": "2022-06-10",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_26",
    "institutionId": "inst-vinculos",
    "name": "Marchesani Franccesca",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_44",
      "u_padre_45"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Marchesani%20Franccesca&background=random",
    "birthDate": "2021-07-22",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_27",
    "institutionId": "inst-vinculos",
    "name": "Marciano Uranga Castro Sara",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_staff_10",
      "u_padre_46"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Marciano%20Uranga%20Castro%20Sara&background=random",
    "birthDate": "2021-12-29",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_28",
    "institutionId": "inst-vinculos",
    "name": "Mieres Martiniano",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_47",
      "u_padre_48"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mieres%20Martiniano&background=random",
    "birthDate": "2021-10-20",
    "attendanceRate": 94
  },
  {
    "id": "u_estudiante_29",
    "institutionId": "inst-vinculos",
    "name": "Olmedo Julieta",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_49",
      "u_padre_50"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Olmedo%20Julieta&background=random",
    "birthDate": "2022-06-20",
    "attendanceRate": 93
  },
  {
    "id": "u_estudiante_30",
    "institutionId": "inst-vinculos",
    "name": "Reimondez Oliver Luciano",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_51",
      "u_padre_52"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Reimondez%20Oliver%20Luciano&background=random",
    "birthDate": "2022-05-11",
    "attendanceRate": 91
  },
  {
    "id": "u_estudiante_31",
    "institutionId": "inst-vinculos",
    "name": "Salinas Piedrabuena Francisco René",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_53",
      "u_padre_54"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Salinas%20Piedrabuena%20Francisco%20Ren%C3%A9&background=random",
    "birthDate": "2022-04-18",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_32",
    "institutionId": "inst-vinculos",
    "name": "Tomás Segovia Ian",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_55",
      "u_padre_56"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Tom%C3%A1s%20Segovia%20Ian&background=random",
    "birthDate": "2022-05-19",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_33",
    "institutionId": "inst-vinculos",
    "name": "Van Autenboer Terraza Mae",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_57",
      "u_padre_58"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Van%20Autenboer%20Terraza%20Mae&background=random",
    "birthDate": "2021-07-27",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_34",
    "institutionId": "inst-vinculos",
    "name": "Verón Conchillo Blas",
    "aulaId": "aula_cielo",
    "parentIds": [
      "u_padre_59",
      "u_padre_60"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Ver%C3%B3n%20Conchillo%20Blas&background=random",
    "birthDate": "2022-02-25",
    "attendanceRate": 81
  },
  {
    "id": "u_estudiante_35",
    "institutionId": "inst-vinculos",
    "name": "Altuna Filomena",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_61"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Altuna%20Filomena&background=random",
    "birthDate": "2020-11-11",
    "attendanceRate": 97
  },
  {
    "id": "u_estudiante_36",
    "institutionId": "inst-vinculos",
    "name": "Bengoa Walser Emma",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_62",
      "u_padre_63"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Bengoa%20Walser%20Emma&background=random",
    "birthDate": "2020-07-29",
    "attendanceRate": 90
  },
  {
    "id": "u_estudiante_37",
    "institutionId": "inst-vinculos",
    "name": "Boviez Méndez Felipe",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_64",
      "u_padre_65"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Boviez%20M%C3%A9ndez%20Felipe&background=random",
    "birthDate": "2021-06-23",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_38",
    "institutionId": "inst-vinculos",
    "name": "Brendel López Matheo",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_66",
      "u_padre_67"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Brendel%20L%C3%B3pez%20Matheo&background=random",
    "birthDate": "2020-09-16",
    "attendanceRate": 92
  },
  {
    "id": "u_estudiante_39",
    "institutionId": "inst-vinculos",
    "name": "Coronel Emma",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_68",
      "u_padre_69"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Coronel%20Emma&background=random",
    "birthDate": "2021-05-24",
    "attendanceRate": 89
  },
  {
    "id": "u_estudiante_40",
    "institutionId": "inst-vinculos",
    "name": "Fuentes Cancelarich Vera",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_70",
      "u_padre_71"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Fuentes%20Cancelarich%20Vera&background=random",
    "birthDate": "2020-07-28",
    "attendanceRate": 82
  },
  {
    "id": "u_estudiante_41",
    "institutionId": "inst-vinculos",
    "name": "González Ramirez Alexis Gastón",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_72"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Gonz%C3%A1lez%20Ramirez%20Alexis%20Gast%C3%B3n&background=random",
    "birthDate": "2020-08-21",
    "attendanceRate": 99
  },
  {
    "id": "u_estudiante_42",
    "institutionId": "inst-vinculos",
    "name": "Mehrbald Boloqui Victoria",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_73",
      "u_padre_74"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Mehrbald%20Boloqui%20Victoria&background=random",
    "birthDate": "2021-01-06",
    "attendanceRate": 83
  },
  {
    "id": "u_estudiante_43",
    "institutionId": "inst-vinculos",
    "name": "Saenz Ariana",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_75",
      "u_padre_76"
    ],
    "avatar": "https://ui-avatars.com/api/?name=Saenz%20Ariana&background=random",
    "birthDate": "2021-03-05",
    "attendanceRate": 80
  },
  {
    "id": "u_estudiante_44",
    "institutionId": "inst-vinculos",
    "name": "Sánchez Fernández Miranda Xairo",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_77",
      "u_padre_78"
    ],
    "avatar": "https://ui-avatars.com/api/?name=S%C3%A1nchez%20Fern%C3%A1ndez%20Miranda%20Xairo&background=random",
    "birthDate": "2021-02-17",
    "attendanceRate": 98
  },
  {
    "id": "u_estudiante_45",
    "institutionId": "inst-vinculos",
    "name": "Tórtola Torres Sofía",
    "aulaId": "aula_vuelo",
    "parentIds": [
      "u_padre_79",
      "u_padre_80"
    ],
    "avatar": "https://ui-avatars.com/api/?name=T%C3%B3rtola%20Torres%20Sof%C3%ADa&background=random",
    "birthDate": "2020-09-12",
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
  }
];

const storedNotifications = typeof window !== 'undefined' ? localStorage.getItem('MOCK_NOTIFICATIONS') : null;
export const MOCK_NOTIFICATIONS: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
export const MOCK_CONVERSATIONS: Conversation[] = [];
const storedMessages = typeof window !== 'undefined' ? localStorage.getItem('MOCK_MESSAGES') : null;
export const MOCK_MESSAGES: Record<string, Message[]> = storedMessages ? JSON.parse(storedMessages) : {};
export const MOCK_PAYMENTS: Payment[] = [];

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

