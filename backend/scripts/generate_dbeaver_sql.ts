import * as fs from 'fs';
import * as path from 'path';

// Import from frontend
import {
    MOCK_AULAS, MOCK_NINOS, INST_VINCULOS,
    MOCK_EVENTS, MOCK_FEED, MOCK_COMMUNICATIONS
} from '../../frontend/services/mockData';
import { MOCK_USERS } from '../../frontend/services/api';

const outPath = path.join(__dirname, '../../migracion_dbeaver.sql');

let sql = `-- SCRIPT DE MIGRACIÓN PARA DBEAVER\n`;
sql += `-- Generado automáticamente tomando MOCK_USERS y mockData.ts\n\n`;

// 1. DDL (CREACIÓN DE TABLAS)
sql += `CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    primary_color VARCHAR(50),
    secondary_color VARCHAR(50)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50),
    avatar VARCHAR(500),
    requires_password_change BOOLEAN DEFAULT FALSE
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS user_institutions (
    user_id VARCHAR(50) REFERENCES users(id),
    institution_id VARCHAR(50) REFERENCES institutions(id),
    role VARCHAR(50),
    PRIMARY KEY(user_id, institution_id)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS aulas (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    name VARCHAR(255) NOT NULL,
    capacity INT,
    color VARCHAR(100)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS aula_teachers (
    aula_id VARCHAR(50) REFERENCES aulas(id),
    teacher_id VARCHAR(50) REFERENCES users(id),
    type VARCHAR(50),
    PRIMARY KEY(aula_id, teacher_id)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    aula_id VARCHAR(50) REFERENCES aulas(id),
    name VARCHAR(255) NOT NULL,
    dni VARCHAR(50),
    birth_date DATE,
    avatar VARCHAR(500),
    attendance_rate INT
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS student_parents (
    student_id VARCHAR(50) REFERENCES students(id),
    parent_id VARCHAR(50) REFERENCES users(id),
    PRIMARY KEY(student_id, parent_id)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    title VARCHAR(255) NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    type VARCHAR(50),
    color VARCHAR(100),
    creator_id VARCHAR(50) REFERENCES users(id),
    description TEXT,
    shared_with_scope VARCHAR(50)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS feed_items (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    course_id VARCHAR(50),
    type VARCHAR(50),
    scope VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    posted_at TIMESTAMP,
    author_name VARCHAR(255),
    material_type VARCHAR(50),
    url VARCHAR(500)
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS communications (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    sender_id VARCHAR(50) REFERENCES users(id),
    sender_name VARCHAR(255),
    created_at TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);\n\n`;

// 2. DML (INSERCIÓN DE DATOS)
sql += `-- ================================\n`;
sql += `-- INSERCIÓN DE DATOS\n`;
sql += `-- ================================\n\n`;

const escape = (str: any) => {
    if (str === null || str === undefined) return 'NULL';
    return "'" + String(str).replace(/'/g, "''") + "'";
};

// Institutions fallback
sql += `INSERT INTO institutions (id, name, slug, primary_color, secondary_color) VALUES \n`;
sql += `('inst-vinculos', 'Vínculos de Libertad', 'vinculos-de-libertad', '#0ea5e9', '#0369a1') ON CONFLICT DO NOTHING;\n\n`;

// Users
if (MOCK_USERS && MOCK_USERS.length > 0) {
    MOCK_USERS.forEach((mockWrapper: any) => {
        const u = mockWrapper.user;
        const pass = u.passwordHash || 'vinculos';
        const reqChange = u.requiresPasswordChange ? 'TRUE' : 'FALSE';
        sql += `INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES (${escape(u.id)}, ${escape(u.name)}, ${escape(u.email)}, ${escape(pass)}, ${escape(u.role)}, ${escape(u.avatar)}, ${reqChange}) ON CONFLICT DO NOTHING;\n`;

        if (mockWrapper.institutions) {
            mockWrapper.institutions.forEach((inst: any) => {
                sql += `INSERT INTO user_institutions (user_id, institution_id, role) VALUES (${escape(u.id)}, ${escape(inst.institutionId)}, ${escape(inst.role)}) ON CONFLICT DO NOTHING;\n`;
            });
        }
    });
    sql += '\n';
}

// Aulas
if (MOCK_AULAS && MOCK_AULAS.length > 0) {
    MOCK_AULAS.forEach((aula: any) => {
        sql += `INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES (${escape(aula.id)}, ${escape(aula.institutionId)}, ${escape(aula.name)}, ${aula.capacity || 'NULL'}, ${escape(aula.color)}) ON CONFLICT DO NOTHING;\n`;

        if (aula.teachers) {
            aula.teachers.forEach((tid: any) => {
                sql += `INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES (${escape(aula.id)}, ${escape(tid)}, 'TEACHER') ON CONFLICT DO NOTHING;\n`;
            });
        }
        if (aula.assistants) {
            aula.assistants.forEach((tid: any) => {
                sql += `INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES (${escape(aula.id)}, ${escape(tid)}, 'ASSISTANT') ON CONFLICT DO NOTHING;\n`;
            });
        }
    });
    sql += '\n';
}

// Students
if (MOCK_NINOS && MOCK_NINOS.length > 0) {
    MOCK_NINOS.forEach((nino: any) => {
        sql += `INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES (${escape(nino.id)}, ${escape(nino.institutionId)}, ${escape(nino.aulaId)}, ${escape(nino.name)}, ${escape(nino.dni)}, ${escape(nino.birthDate)}, ${escape(nino.avatar)}, ${nino.attendanceRate || 'NULL'}) ON CONFLICT DO NOTHING;\n`;

        if (nino.parentIds) {
            nino.parentIds.forEach((pid: any) => {
                sql += `INSERT INTO student_parents (student_id, parent_id) VALUES (${escape(nino.id)}, ${escape(pid)}) ON CONFLICT DO NOTHING;\n`;
            });
        }
    });
    sql += '\n';
}

// Events
if (MOCK_EVENTS && MOCK_EVENTS.length > 0) {
    MOCK_EVENTS.forEach((e: any) => {
        const start = e.start ? new Date(e.start).toISOString() : null;
        const end = e.end ? new Date(e.end).toISOString() : null;
        const scope = e.sharedWith && e.sharedWith.scope ? e.sharedWith.scope : null;
        sql += `INSERT INTO events (id, institution_id, title, start_date, end_date, type, color, creator_id, description, shared_with_scope) VALUES (${escape(e.id)}, ${escape(e.institutionId)}, ${escape(e.title)}, ${escape(start)}, ${escape(end)}, ${escape(e.type)}, ${escape(e.color)}, ${escape(e.creatorId)}, ${escape(e.description)}, ${escape(scope)}) ON CONFLICT DO NOTHING;\n`;
    });
    sql += '\n';
}

// Feed
if (MOCK_FEED && MOCK_FEED.length > 0) {
    MOCK_FEED.forEach((f: any) => {
        const postedAt = f.postedAt ? new Date(f.postedAt).toISOString() : null;
        sql += `INSERT INTO feed_items (id, institution_id, course_id, type, scope, title, description, posted_at, author_name, material_type, url) VALUES (${escape(f.id)}, ${escape(f.institutionId)}, ${escape(f.courseId)}, ${escape(f.type)}, ${escape(f.scope)}, ${escape(f.title)}, ${escape(f.description)}, ${escape(postedAt)}, ${escape(f.author)}, ${escape(f.materialType)}, ${escape(f.url)}) ON CONFLICT DO NOTHING;\n`;
    });
    sql += '\n';
}

// Communications
if (MOCK_COMMUNICATIONS && MOCK_COMMUNICATIONS.length > 0) {
    MOCK_COMMUNICATIONS.forEach((c: any) => {
        const createdAt = c.createdAt ? new Date(c.createdAt).toISOString() : null;
        const isRead = c.isRead ? 'TRUE' : 'FALSE';
        sql += `INSERT INTO communications (id, institution_id, type, title, content, sender_id, sender_name, created_at, is_read) VALUES (${escape(c.id)}, ${escape(c.institutionId)}, ${escape(c.type)}, ${escape(c.title)}, ${escape(c.content)}, ${escape(c.senderId)}, ${escape(c.senderName)}, ${escape(createdAt)}, ${isRead}) ON CONFLICT DO NOTHING;\n`;
    });
    sql += '\n';
}

fs.writeFileSync(outPath, sql, 'utf8');
console.log('✅ Archivo SQL generado en ' + outPath);
