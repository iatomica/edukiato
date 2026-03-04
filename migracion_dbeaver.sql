-- SCRIPT DE MIGRACIÓN PARA DBEAVER
-- Generado automáticamente tomando MOCK_USERS y mockData.ts

CREATE TABLE IF NOT EXISTS institutions (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    primary_color VARCHAR(50),
    secondary_color VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50),
    avatar VARCHAR(500),
    requires_password_change BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_institutions (
    user_id VARCHAR(50) REFERENCES users(id),
    institution_id VARCHAR(50) REFERENCES institutions(id),
    role VARCHAR(50),
    PRIMARY KEY(user_id, institution_id)
);

CREATE TABLE IF NOT EXISTS aulas (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    name VARCHAR(255) NOT NULL,
    capacity INT,
    color VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS aula_teachers (
    aula_id VARCHAR(50) REFERENCES aulas(id),
    teacher_id VARCHAR(50) REFERENCES users(id),
    type VARCHAR(50),
    PRIMARY KEY(aula_id, teacher_id)
);

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    aula_id VARCHAR(50) REFERENCES aulas(id),
    name VARCHAR(255) NOT NULL,
    dni VARCHAR(50),
    birth_date DATE,
    avatar VARCHAR(500),
    attendance_rate INT
);

CREATE TABLE IF NOT EXISTS student_parents (
    student_id VARCHAR(50) REFERENCES students(id),
    parent_id VARCHAR(50) REFERENCES users(id),
    PRIMARY KEY(student_id, parent_id)
);

CREATE TABLE IF NOT EXISTS events (
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
);

CREATE TABLE IF NOT EXISTS feed_items (
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
);

CREATE TABLE IF NOT EXISTS communications (
    id VARCHAR(50) PRIMARY KEY,
    institution_id VARCHAR(50) REFERENCES institutions(id),
    type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    sender_id VARCHAR(50) REFERENCES users(id),
    sender_name VARCHAR(255),
    created_at TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- ================================
-- INSERCIÓN DE DATOS
-- ================================

INSERT INTO institutions (id, name, slug, primary_color, secondary_color) VALUES 
('inst-vinculos', 'Vínculos de Libertad', 'vinculos-de-libertad', '#0ea5e9', '#0369a1') ON CONFLICT DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_0', 'Gabriel Silva', 'porisilva92@gmail.com', 'vinculos', 'ESPECIALES', 'https://ui-avatars.com/api/?name=Gabriel%20Silva&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_0', 'inst-vinculos', 'ESPECIALES') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_1', 'Leonardo Videla', 'leonardovidela86@gmail.com', 'vinculos', 'ESPECIALES', 'https://ui-avatars.com/api/?name=Leonardo%20Videla&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_1', 'inst-vinculos', 'ESPECIALES') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_2', 'Fiorela Sotelo', 'fiorelasotelo63@gmail.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Fiorela%20Sotelo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_2', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_3', 'Lorena Mori', 'lore0377@gmail.com', 'vinculos', 'ADMIN_INSTITUCION', 'https://ui-avatars.com/api/?name=Lorena%20Mori&background=random', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_3', 'inst-vinculos', 'ADMIN_INSTITUCION') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_4', 'Romina Engel', 'romieng16@outlook.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Romina%20Engel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_4', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_5', 'Romina Alvarenga', 'alvarengarominaf@gmail.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Romina%20Alvarenga&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_5', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_6', 'Antonela Michelena', 'antomiche49@gmail.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Antonela%20Michelena&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_6', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_7', 'Nellida Figueroa', 'nellyfigue168@gmail.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Nellida%20Figueroa&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_7', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_8', 'Stefanía Bahl', 'stefaniabhl@gmail.com', 'vinculos', 'DOCENTE', 'https://ui-avatars.com/api/?name=Stefan%C3%ADa%20Bahl&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_8', 'inst-vinculos', 'DOCENTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_9', 'María Laura Stamponi', 'lalastamponi@gmail.com', 'vinculos', 'ADMIN_INSTITUCION', 'https://ui-avatars.com/api/?name=Mar%C3%ADa%20Laura%20Stamponi&background=random', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_9', 'inst-vinculos', 'ADMIN_INSTITUCION') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_10', 'Sol Duarte', 'solduarte55@gmail.com', 'vinculos', 'ESPECIALES', 'https://ui-avatars.com/api/?name=Sol%20Duarte&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_10', 'inst-vinculos', 'ESPECIALES') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_11', 'Guillermo Peirano', 'guillecandombe@gmail.com', 'vinculos', 'ESPECIALES', 'https://ui-avatars.com/api/?name=Guillermo%20Peirano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_11', 'inst-vinculos', 'ESPECIALES') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_12', 'Seila Ramos González', 'seilarg@hotmail.com', 'vinculos', 'SUPER_ADMIN', 'https://ui-avatars.com/api/?name=Seila%20Ramos%20Gonz%C3%A1lez&background=random', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_12', 'inst-vinculos', 'SUPER_ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_staff_13', 'Romina Ayala', 'rushayala87@gmail.com', 'vinculos', 'SUPER_ADMIN', 'https://ui-avatars.com/api/?name=Romina%20Ayala&background=random', FALSE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_staff_13', 'inst-vinculos', 'SUPER_ADMIN') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_0', 'Avendaño Sancha Gisel Ximena', 'avendanosancha@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Avenda%C3%B1o%20Sancha%20Gisel%20Ximena&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_0', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_1', 'Álvarez Diego Matías', 'd.alvarez77@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Diego%20Mat%C3%ADas&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_1', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_0', 'Álvarez Nina', 'alvarez.nina@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Nina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_0', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_2', 'Micaela Lamarque', 'micalamarquee@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Micaela%20Lamarque&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_2', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_3', 'Nicolás Battini', 'nicolasbattini@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Nicol%C3%A1s%20Battini&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_3', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_1', 'Battini Lamarque Manuel', 'battini.lamarque.manuel@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Battini%20Lamarque%20Manuel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_1', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_4', 'Rinaldi Agostina', 'agostinarinaldi@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Rinaldi%20Agostina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_4', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_5', 'Cisneros Néstor David', 'ndcisneros@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Cisneros%20N%C3%A9stor%20David&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_5', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_2', 'Cisneros Rinaldi Anna', 'cisneros.rinaldi.anna@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Anna&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_2', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_6', 'San Román Micaela', 'sanromanm25@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=San%20Rom%C3%A1n%20Micaela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_6', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_7', 'Espinoza Aron Nicolás Gabriel', 'nicoespi099@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Espinoza%20Aron%20Nicol%C3%A1s%20Gabriel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_7', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_3', 'Espinosa San Román Alaia', 'espinosa.san.roman.alaia@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Espinosa%20San%20Rom%C3%A1n%20Alaia&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_3', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_8', 'Hughes John Eric', 'eric1994hughes@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Hughes%20John%20Eric&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_8', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_4', 'Hughes Sotelo Lisandro', 'hughes.sotelo.lisandro@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Hughes%20Sotelo%20Lisandro&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_4', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_9', 'Pérsico María Candela', 'persicocandela@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=P%C3%A9rsico%20Mar%C3%ADa%20Candela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_9', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_10', 'Moreno Juan Andrés', 'juan.more.no.est@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Moreno%20Juan%20Andr%C3%A9s&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_10', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_5', 'Moreno Pérsico Valentín', 'moreno.persico.valentin@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Moreno%20P%C3%A9rsico%20Valent%C3%ADn&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_5', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_11', 'Diaz María Salomé', 'salome.diaz982015@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Diaz%20Mar%C3%ADa%20Salom%C3%A9&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_11', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_12', 'Rocha Juan Pablo', 'pablorocha94@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Rocha%20Juan%20Pablo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_12', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_6', 'Rocha Bruno', 'rocha.bruno@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Rocha%20Bruno&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_6', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_13', 'Pérez Pellegrino Yanina', 'yaninapellegrino@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=P%C3%A9rez%20Pellegrino%20Yanina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_13', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_14', 'Sánchez María Laura', 'licob2003@yahoo.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Mar%C3%ADa%20Laura&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_14', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_7', 'Sánchez Felipe', 'sanchez.felipe@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Felipe&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_7', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_15', 'Angie Guadalupe Suarez', 'angieg.suarez@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Angie%20Guadalupe%20Suarez&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_15', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_16', 'Segatti Guillermo Andrés', 'guillermosegatti@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Segatti%20Guillermo%20Andr%C3%A9s&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_16', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_8', 'Segatti Suarez Stefano', 'segatti.suarez.stefano@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Segatti%20Suarez%20Stefano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_8', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_17', 'Bogado Bustos Lucy del Pilar', 'lucybogado55@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Bogado%20Bustos%20Lucy%20del%20Pilar&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_17', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_18', 'Ríos Hernández Lucas Emanuel', 'lucasr.pm@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=R%C3%ADos%20Hern%C3%A1ndez%20Lucas%20Emanuel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_18', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_9', 'Bogado Ríos Coco', 'bogado.rios.coco@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Bogado%20R%C3%ADos%20Coco&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_9', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_19', 'Martelli Antonela', 'antonelamartelli@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Martelli%20Antonela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_19', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_20', 'Cevoli Fernando', 'fernandocevoli@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Cevoli%20Fernando&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_20', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_10', 'Cevoli Charo', 'cevoli.charo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Cevoli%20Charo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_10', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_21', 'Scmidtchen Carrasco Raian Roxana Millaray', 'raiantkd94@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Scmidtchen%20Carrasco%20Raian%20Roxana%20Millaray&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_21', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_22', 'Catalán Giaroli Luis Alberto', 'estacionballenera42@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Catal%C3%A1n%20Giaroli%20Luis%20Alberto&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_22', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_11', 'Catalán Scmidtchen Luis Octavio', 'catalan.scmidtchen.luis.octavio@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Catal%C3%A1n%20Scmidtchen%20Luis%20Octavio&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_11', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_12', 'Rocha Victorino', 'rocha.victorino@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Rocha%20Victorino&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_12', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_23', 'Cuesta Melisa Daniela', 'melisadcuesta@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Cuesta%20Melisa%20Daniela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_23', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_24', 'Rodríguez Conte Grand Gerónimo', 'gero_14@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Rodr%C3%ADguez%20Conte%20Grand%20Ger%C3%B3nimo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_24', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_13', 'Rodriguez Cuesta Nazareno', 'rodriguez.cuesta.nazareno@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Rodriguez%20Cuesta%20Nazareno&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_13', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_25', 'Melgarejo Emma Romina', 'emmaromina155@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Melgarejo%20Emma%20Romina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_25', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_26', 'Biasutti Federico Eduardo', 'biasuttifederico@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Biasutti%20Federico%20Eduardo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_26', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_14', 'Biasutti Ciro Eduardo', 'biasutti.ciro.eduardo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Biasutti%20Ciro%20Eduardo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_14', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_15', 'Cisneros Rinaldi Facundo', 'cisneros.rinaldi.facundo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Facundo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_15', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_27', 'Cristaldo Mariela', 'marielacristal@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Cristaldo%20Mariela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_27', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_28', 'Córdoba Guillermo Sebastián', 'guille-eltucu@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Guillermo%20Sebasti%C3%A1n&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_28', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_16', 'Córdoba Sol Fiorella', 'cordoba.sol.fiorella@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Sol%20Fiorella&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_16', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_29', 'Mangiapane Virginia', 'virmangiapane@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Mangiapane%20Virginia&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_29', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_30', 'Dümmig Guillermo Federico', 'billydummig@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=D%C3%BCmmig%20Guillermo%20Federico&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_30', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_17', 'Dümmig Clara', 'dummig.clara@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=D%C3%BCmmig%20Clara&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_17', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_31', 'Torres María Guadalupe', 'guada1825@yahoo.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Torres%20Mar%C3%ADa%20Guadalupe&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_31', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_32', 'Fernández Julio', 'julisf40@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Fern%C3%A1ndez%20Julio&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_32', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_18', 'Fernandez Torres Juana', 'fernandez.torres.juana@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Fernandez%20Torres%20Juana&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_18', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_33', 'Torres Silvina Ines', 'silvinainestorres@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Torres%20Silvina%20Ines&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_33', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_34', 'Manzi Gabriel Alejandro', 'mangabale@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Manzi%20Gabriel%20Alejandro&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_34', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_19', 'Manzi Lautaro Andrés', 'manzi.lautaro.andres@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Manzi%20Lautaro%20Andr%C3%A9s&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_19', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_35', 'Pierattini Martínez Regina', 'pierattinimregina@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Pierattini%20Mart%C3%ADnez%20Regina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_35', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_36', 'Ostanello Leonardo', 'ostanelloleonardog@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Ostanello%20Leonardo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_36', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_20', 'Ostanello Pierattini Luna', 'ostanello.pierattini.luna@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Ostanello%20Pierattini%20Luna&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_20', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_21', 'Álvarez Lola Milagros', 'alvarez.lola.milagros@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Lola%20Milagros&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_21', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_37', 'Familia de Arriagada Breppe Enzo Luka', 'anaymartinypedro@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Breppe%20Ana%20Carla&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_37', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_22', 'Arriagada Breppe Enzo Luka', 'arriagada.breppe.enzo.luka@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Arriagada%20Breppe%20Enzo%20Luka&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_22', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_38', 'Esteche Florencia Ayelen', 'flopavalen2@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Esteche%20Florencia%20Ayelen&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_38', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_39', 'Barrientos Claudio Nicolas', 'barrientosnicolas426@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Barrientos%20Claudio%20Nicolas&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_39', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_23', 'Barrientos Alejo', 'barrientos.alejo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Barrientos%20Alejo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_23', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_40', 'Villagra Malena Maite', 'villagramalena7@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Villagra%20Malena%20Maite&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_40', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_41', 'Díaz Claudio Emanuel', 'cemanueld@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=D%C3%ADaz%20Claudio%20Emanuel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_41', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_24', 'Díaz Enzo Joaquín', 'diaz.enzo.joaquin@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=D%C3%ADaz%20Enzo%20Joaqu%C3%ADn&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_24', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_42', 'Asaro Verónica', 'vasaro1312@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Asaro%20Ver%C3%B3nica&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_42', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_43', 'Evans Diego', 'diegoevans@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Evans%20Diego&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_43', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_25', 'Evans Asaro Justina', 'evans.asaro.justina@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Evans%20Asaro%20Justina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_25', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_44', 'Amira Gracia Villalobos', 'amigraciav@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Amira%20Gracia%20Villalobos&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_44', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_45', 'Marchesani Nicolas', 'nicolasmarchesani@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Marchesani%20Nicolas&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_45', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_26', 'Marchesani Franccesca', 'marchesani.franccesca@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Marchesani%20Franccesca&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_26', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_46', 'Carlos Ignacio Marciano Uranga Castro', 'curanga@live.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Carlos%20Ignacio%20Marciano%20Uranga%20Castro&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_46', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_27', 'Marciano Uranga Castro Sara', 'marciano.uranga.castro.sara@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Marciano%20Uranga%20Castro%20Sara&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_27', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_47', 'Pereyra Paula', 'paula621@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Pereyra%20Paula&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_47', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_48', 'Mieres Maximiliano', 'mieresmaxi@outlook.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Mieres%20Maximiliano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_48', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_28', 'Mieres Martiniano', 'mieres.martiniano@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Mieres%20Martiniano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_28', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_49', 'Viera Ruth', 'ruthviera_10@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Viera%20Ruth&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_49', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_50', 'Olmedo Gerardo Maximiliano', 'gerardo.maximiliano.olmedo@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Olmedo%20Gerardo%20Maximiliano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_50', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_29', 'Olmedo Julieta', 'olmedo.julieta@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Olmedo%20Julieta&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_29', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_51', 'Yesica Yanina Domingorena', 'yesi.domingorena@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Yesica%20Yanina%20Domingorena&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_51', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_52', 'Martín Guillermo Reimondez', 'mgreimondez@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Mart%C3%ADn%20Guillermo%20Reimondez&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_52', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_30', 'Reimondez Oliver Luciano', 'reimondez.oliver.luciano@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Reimondez%20Oliver%20Luciano&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_30', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_53', 'Piedrabuena Montero Natalia Soledad', 'montero.natalia.soledad@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Piedrabuena%20Montero%20Natalia%20Soledad&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_53', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_54', 'Salinas René Ricardo Daniel', 'renericardodanielsalinas@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Salinas%20Ren%C3%A9%20Ricardo%20Daniel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_54', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_31', 'Salinas Piedrabuena Francisco René', 'salinas.piedrabuena.francisco.rene@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Salinas%20Piedrabuena%20Francisco%20Ren%C3%A9&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_31', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_55', 'Segovia Natalia', 'natysegovia20@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Segovia%20Natalia&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_55', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_56', 'Guillermo López Servate', 'guillermolopezservate@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Guillermo%20L%C3%B3pez%20Servate&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_56', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_32', 'Tomás Segovia Ian', 'tomas.segovia.ian@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Tom%C3%A1s%20Segovia%20Ian&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_32', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_57', 'Terraza Magali', 'magaliterraza1@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Terraza%20Magali&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_57', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_58', 'Van Autenboer Adrián Horacio', 'adrianvan08@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Van%20Autenboer%20Adri%C3%A1n%20Horacio&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_58', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_33', 'Van Autenboer Terraza Mae', 'van.autenboer.terraza.mae@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Van%20Autenboer%20Terraza%20Mae&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_33', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_59', 'Suyay Conchillo', 'conchillosuyay@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Suyay%20Conchillo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_59', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_60', 'Diego Veron', 'dveron678@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Diego%20Veron&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_60', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_34', 'Verón Conchillo Blas', 'veron.conchillo.blas@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Ver%C3%B3n%20Conchillo%20Blas&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_34', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_61', 'Familia de Altuna Filomena', 'faus_ti@cloud.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Paez%20Candela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_61', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_35', 'Altuna Filomena', 'altuna.filomena@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Altuna%20Filomena&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_35', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_62', 'Walser Mariel Ivonne', 'mariel.walser@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Walser%20Mariel%20Ivonne&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_62', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_63', 'Bengoa Brian Andrés', 'brianbengoa07@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Bengoa%20Brian%20Andr%C3%A9s&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_63', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_36', 'Bengoa Walser Emma', 'bengoa.walser.emma@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Bengoa%20Walser%20Emma&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_36', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_64', 'Méndez Romina Soledad', 'rominamoon1@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=M%C3%A9ndez%20Romina%20Soledad&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_64', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_65', 'Boviez Edgardo Andrés', 'eboviez@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Boviez%20Edgardo%20Andr%C3%A9s&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_65', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_37', 'Boviez Méndez Felipe', 'boviez.mendez.felipe@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Boviez%20M%C3%A9ndez%20Felipe&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_37', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_66', 'López Rueda Karina', 'karilopezr24@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=L%C3%B3pez%20Rueda%20Karina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_66', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_67', 'Brendel Máximo', 'maximobrendel@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Brendel%20M%C3%A1ximo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_67', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_38', 'Brendel López Matheo', 'brendel.lopez.matheo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Brendel%20L%C3%B3pez%20Matheo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_38', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_68', 'Basualto Cobos Ailen Fernanda', 'ailen.basualto@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Basualto%20Cobos%20Ailen%20Fernanda&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_68', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_69', 'Coronel Félix Guillermo', 'guille28_82@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Coronel%20F%C3%A9lix%20Guillermo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_69', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_39', 'Coronel Emma', 'coronel.emma@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Coronel%20Emma&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_39', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_70', 'Cancelarich Lorena', 'lncancelarich@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Cancelarich%20Lorena&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_70', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_71', 'Fuentes Rios Javier', 'jefuentesrios@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Fuentes%20Rios%20Javier&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_71', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_40', 'Fuentes Cancelarich Vera', 'fuentes.cancelarich.vera@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Fuentes%20Cancelarich%20Vera&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_40', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_72', 'Daniela Marite Ramirez', 'danielaramirez1887@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Daniela%20Marite%20Ramirez&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_72', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_41', 'González Ramirez Alexis Gastón', 'gonzalez.ramirez.alexis.gaston@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Gonz%C3%A1lez%20Ramirez%20Alexis%20Gast%C3%B3n&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_41', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_73', 'Boloqui Romina', 'romiboloqui@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Boloqui%20Romina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_73', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_74', 'Mehrbald Facundo', 'fmehrbald@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Mehrbald%20Facundo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_74', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_42', 'Mehrbald Boloqui Victoria', 'mehrbald.boloqui.victoria@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Mehrbald%20Boloqui%20Victoria&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_42', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_75', 'Tristán Nidia Sabrina', 'sabrinatristanpm@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Trist%C3%A1n%20Nidia%20Sabrina&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_75', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_76', 'Sáenz Martín Damian', 'estudiosaenz@hotmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=S%C3%A1enz%20Mart%C3%ADn%20Damian&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_76', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_43', 'Saenz Ariana', 'saenz.ariana@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=Saenz%20Ariana&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_43', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_77', 'Sanchez Carnero Noela', 'noelas@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Sanchez%20Carnero%20Noela&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_77', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_78', 'Fernandez Miranda Magaña Álvaro', 'caminante109@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Fernandez%20Miranda%20Maga%C3%B1a%20%C3%81lvaro&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_78', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_44', 'Sánchez Fernández Miranda Xairo', 'sanchez.fernandez.miranda.xairo@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Fern%C3%A1ndez%20Miranda%20Xairo&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_44', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_79', 'Torres Débora', 'deboratorres1991@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Torres%20D%C3%A9bora&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_79', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_padre_80', 'Tortola Martín Ezequiel', 'metortola@gmail.com', 'vinculos', 'PADRE', 'https://ui-avatars.com/api/?name=Tortola%20Mart%C3%ADn%20Ezequiel&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_padre_80', 'inst-vinculos', 'PADRE') ON CONFLICT DO NOTHING;
INSERT INTO users (id, name, email, password_hash, role, avatar, requires_password_change) VALUES ('u_estudiante_45', 'Tórtola Torres Sofía', 'tortola.torres.sofia@alumnos.vinculos.edu', 'vinculos', 'ESTUDIANTE', 'https://ui-avatars.com/api/?name=T%C3%B3rtola%20Torres%20Sof%C3%ADa&background=random', TRUE) ON CONFLICT DO NOTHING;
INSERT INTO user_institutions (user_id, institution_id, role) VALUES ('u_estudiante_45', 'inst-vinculos', 'ESTUDIANTE') ON CONFLICT DO NOTHING;

INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES ('aula_anidar', 'inst-vinculos', 'Sala Anidar (45 días a 2 años)', 15, 'bg-rose-100 text-rose-700 border-rose-200') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_anidar', 'u_staff_4', 'TEACHER') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_anidar', 'u_staff_5', 'ASSISTANT') ON CONFLICT DO NOTHING;
INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES ('aula_raiz', 'inst-vinculos', 'Sala Raíz (2 años)', 20, 'bg-amber-100 text-amber-700 border-amber-200') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_raiz', 'u_staff_8', 'TEACHER') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_raiz', 'u_staff_5', 'ASSISTANT') ON CONFLICT DO NOTHING;
INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES ('aula_libertad', 'inst-vinculos', 'Sala Libertad (3 años)', 20, 'bg-emerald-100 text-emerald-700 border-emerald-200') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_libertad', 'u_staff_2', 'TEACHER') ON CONFLICT DO NOTHING;
INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES ('aula_cielo', 'inst-vinculos', 'Sala Cielo (4 años)', 25, 'bg-blue-100 text-blue-700 border-blue-200') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_cielo', 'u_staff_7', 'TEACHER') ON CONFLICT DO NOTHING;
INSERT INTO aulas (id, institution_id, name, capacity, color) VALUES ('aula_vuelo', 'inst-vinculos', 'Sala Vuelo (5 años)', 25, 'bg-indigo-100 text-indigo-700 border-indigo-200') ON CONFLICT DO NOTHING;
INSERT INTO aula_teachers (aula_id, teacher_id, type) VALUES ('aula_vuelo', 'u_staff_6', 'TEACHER') ON CONFLICT DO NOTHING;

INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_0', 'inst-vinculos', 'aula_anidar', 'Álvarez Nina', '70216396', '2025-02-20', 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Nina&background=random', 97) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_0', 'u_padre_0') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_0', 'u_padre_1') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_1', 'inst-vinculos', 'aula_anidar', 'Battini Lamarque Manuel', '70417837', '2025-05-02', 'https://ui-avatars.com/api/?name=Battini%20Lamarque%20Manuel&background=random', 80) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_1', 'u_padre_2') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_1', 'u_padre_3') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_2', 'inst-vinculos', 'aula_anidar', 'Cisneros Rinaldi Anna', '70216294', '2024-09-10', 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Anna&background=random', 85) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_2', 'u_padre_4') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_2', 'u_padre_5') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_3', 'inst-vinculos', 'aula_anidar', 'Espinosa San Román Alaia', '70416978', '2025-01-24', 'https://ui-avatars.com/api/?name=Espinosa%20San%20Rom%C3%A1n%20Alaia&background=random', 80) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_3', 'u_padre_6') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_3', 'u_padre_7') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_4', 'inst-vinculos', 'aula_anidar', 'Hughes Sotelo Lisandro', '70216376', '2025-01-15', 'https://ui-avatars.com/api/?name=Hughes%20Sotelo%20Lisandro&background=random', 81) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_4', 'u_staff_2') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_4', 'u_padre_8') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_5', 'inst-vinculos', 'aula_anidar', 'Moreno Pérsico Valentín', '70417823', '2025-03-20', 'https://ui-avatars.com/api/?name=Moreno%20P%C3%A9rsico%20Valent%C3%ADn&background=random', 91) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_5', 'u_padre_9') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_5', 'u_padre_10') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_6', 'inst-vinculos', 'aula_anidar', 'Rocha Bruno', '70216392', '2025-02-12', 'https://ui-avatars.com/api/?name=Rocha%20Bruno&background=random', 98) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_6', 'u_padre_11') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_6', 'u_padre_12') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_7', 'inst-vinculos', 'aula_anidar', 'Sánchez Felipe', '70593200', '2025-09-18', 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Felipe&background=random', 91) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_7', 'u_padre_13') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_7', 'u_padre_14') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_8', 'inst-vinculos', 'aula_anidar', 'Segatti Suarez Stefano', '70576468', '2024-12-16', 'https://ui-avatars.com/api/?name=Segatti%20Suarez%20Stefano&background=random', 97) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_8', 'u_padre_15') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_8', 'u_padre_16') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_9', 'inst-vinculos', 'aula_raiz', 'Bogado Ríos Coco', '59904799', '2023-09-27', 'https://ui-avatars.com/api/?name=Bogado%20R%C3%ADos%20Coco&background=random', 88) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_9', 'u_padre_17') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_9', 'u_padre_18') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_10', 'inst-vinculos', 'aula_raiz', 'Cevoli Charo', '59904962', '2023-09-25', 'https://ui-avatars.com/api/?name=Cevoli%20Charo&background=random', 86) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_10', 'u_padre_19') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_10', 'u_padre_20') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_11', 'inst-vinculos', 'aula_raiz', 'Catalán Scmidtchen Luis Octavio', '59905041', '2024-01-05', 'https://ui-avatars.com/api/?name=Catal%C3%A1n%20Scmidtchen%20Luis%20Octavio&background=random', 82) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_11', 'u_padre_21') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_11', 'u_padre_22') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_12', 'inst-vinculos', 'aula_raiz', 'Rocha Victorino', '59904954', '2023-08-25', 'https://ui-avatars.com/api/?name=Rocha%20Victorino&background=random', 86) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_12', 'u_padre_11') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_12', 'u_padre_12') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_13', 'inst-vinculos', 'aula_raiz', 'Rodriguez Cuesta Nazareno', '59905078', '2024-03-15', 'https://ui-avatars.com/api/?name=Rodriguez%20Cuesta%20Nazareno&background=random', 94) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_13', 'u_padre_23') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_13', 'u_padre_24') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_14', 'inst-vinculos', 'aula_libertad', 'Biasutti Ciro Eduardo', '59630375', '2023-01-11', 'https://ui-avatars.com/api/?name=Biasutti%20Ciro%20Eduardo&background=random', 84) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_14', 'u_padre_25') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_14', 'u_padre_26') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_15', 'inst-vinculos', 'aula_libertad', 'Cisneros Rinaldi Facundo', '59289270', '2022-09-08', 'https://ui-avatars.com/api/?name=Cisneros%20Rinaldi%20Facundo&background=random', 82) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_15', 'u_padre_4') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_15', 'u_padre_5') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_16', 'inst-vinculos', 'aula_libertad', 'Córdoba Sol Fiorella', '59289293', '2022-09-26', 'https://ui-avatars.com/api/?name=C%C3%B3rdoba%20Sol%20Fiorella&background=random', 86) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_16', 'u_padre_27') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_16', 'u_padre_28') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_17', 'inst-vinculos', 'aula_libertad', 'Dümmig Clara', '59289258', '2022-08-17', 'https://ui-avatars.com/api/?name=D%C3%BCmmig%20Clara&background=random', 95) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_17', 'u_padre_29') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_17', 'u_padre_30') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_18', 'inst-vinculos', 'aula_libertad', 'Fernandez Torres Juana', '59538319', '2023-05-02', 'https://ui-avatars.com/api/?name=Fernandez%20Torres%20Juana&background=random', 86) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_18', 'u_padre_31') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_18', 'u_padre_32') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_19', 'inst-vinculos', 'aula_libertad', 'Manzi Lautaro Andrés', '59538855', '2022-12-09', 'https://ui-avatars.com/api/?name=Manzi%20Lautaro%20Andr%C3%A9s&background=random', 97) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_19', 'u_padre_33') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_19', 'u_padre_34') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_20', 'inst-vinculos', 'aula_libertad', 'Ostanello Pierattini Luna', '59289259', '2022-09-26', 'https://ui-avatars.com/api/?name=Ostanello%20Pierattini%20Luna&background=random', 95) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_20', 'u_padre_35') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_20', 'u_padre_36') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_21', 'inst-vinculos', 'aula_cielo', 'Álvarez Lola Milagros', '59289187', '2022-05-30', 'https://ui-avatars.com/api/?name=%C3%81lvarez%20Lola%20Milagros&background=random', 85) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_21', 'u_padre_0') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_21', 'u_padre_1') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_22', 'inst-vinculos', 'aula_cielo', 'Arriagada Breppe Enzo Luka', '59289193', '2022-06-06', 'https://ui-avatars.com/api/?name=Arriagada%20Breppe%20Enzo%20Luka&background=random', 88) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_22', 'u_padre_37') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_23', 'inst-vinculos', 'aula_cielo', 'Barrientos Alejo', '59246548', '2022-03-14', 'https://ui-avatars.com/api/?name=Barrientos%20Alejo&background=random', 81) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_23', 'u_padre_38') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_23', 'u_padre_39') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_24', 'inst-vinculos', 'aula_cielo', 'Díaz Enzo Joaquín', '59289200', '2022-06-23', 'https://ui-avatars.com/api/?name=D%C3%ADaz%20Enzo%20Joaqu%C3%ADn&background=random', 91) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_24', 'u_padre_40') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_24', 'u_padre_41') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_25', 'inst-vinculos', 'aula_cielo', 'Evans Asaro Justina', '59289192', '2022-06-10', 'https://ui-avatars.com/api/?name=Evans%20Asaro%20Justina&background=random', 80) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_25', 'u_padre_42') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_25', 'u_padre_43') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_26', 'inst-vinculos', 'aula_cielo', 'Marchesani Franccesca', '58987315', '2021-07-22', 'https://ui-avatars.com/api/?name=Marchesani%20Franccesca&background=random', 91) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_26', 'u_padre_44') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_26', 'u_padre_45') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_27', 'inst-vinculos', 'aula_cielo', 'Marciano Uranga Castro Sara', '59125836', '2021-12-29', 'https://ui-avatars.com/api/?name=Marciano%20Uranga%20Castro%20Sara&background=random', 81) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_27', 'u_staff_10') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_27', 'u_padre_46') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_28', 'inst-vinculos', 'aula_cielo', 'Mieres Martiniano', '58913759', '2021-10-20', 'https://ui-avatars.com/api/?name=Mieres%20Martiniano&background=random', 94) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_28', 'u_padre_47') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_28', 'u_padre_48') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_29', 'inst-vinculos', 'aula_cielo', 'Olmedo Julieta', '59289203', '2022-06-20', 'https://ui-avatars.com/api/?name=Olmedo%20Julieta&background=random', 93) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_29', 'u_padre_49') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_29', 'u_padre_50') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_30', 'inst-vinculos', 'aula_cielo', 'Reimondez Oliver Luciano', '59289166', '2022-05-11', 'https://ui-avatars.com/api/?name=Reimondez%20Oliver%20Luciano&background=random', 91) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_30', 'u_padre_51') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_30', 'u_padre_52') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_31', 'inst-vinculos', 'aula_cielo', 'Salinas Piedrabuena Francisco René', '59336409', '2022-04-18', 'https://ui-avatars.com/api/?name=Salinas%20Piedrabuena%20Francisco%20Ren%C3%A9&background=random', 97) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_31', 'u_padre_53') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_31', 'u_padre_54') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_32', 'inst-vinculos', 'aula_cielo', 'Tomás Segovia Ian', '59289179', '2022-05-19', 'https://ui-avatars.com/api/?name=Tom%C3%A1s%20Segovia%20Ian&background=random', 83) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_32', 'u_padre_55') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_32', 'u_padre_56') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_33', 'inst-vinculos', 'aula_cielo', 'Van Autenboer Terraza Mae', '58543268', '2021-07-27', 'https://ui-avatars.com/api/?name=Van%20Autenboer%20Terraza%20Mae&background=random', 98) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_33', 'u_padre_57') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_33', 'u_padre_58') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_34', 'inst-vinculos', 'aula_cielo', 'Verón Conchillo Blas', '58913884', '2022-02-25', 'https://ui-avatars.com/api/?name=Ver%C3%B3n%20Conchillo%20Blas&background=random', 81) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_34', 'u_padre_59') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_34', 'u_padre_60') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_35', 'inst-vinculos', 'aula_vuelo', 'Altuna Filomena', '58544763', '2020-11-11', 'https://ui-avatars.com/api/?name=Altuna%20Filomena&background=random', 97) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_35', 'u_padre_61') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_36', 'inst-vinculos', 'aula_vuelo', 'Bengoa Walser Emma', '58337890', '2020-07-29', 'https://ui-avatars.com/api/?name=Bengoa%20Walser%20Emma&background=random', 90) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_36', 'u_padre_62') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_36', 'u_padre_63') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_37', 'inst-vinculos', 'aula_vuelo', 'Boviez Méndez Felipe', '58543225', '2021-06-23', 'https://ui-avatars.com/api/?name=Boviez%20M%C3%A9ndez%20Felipe&background=random', 83) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_37', 'u_padre_64') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_37', 'u_padre_65') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_38', 'inst-vinculos', 'aula_vuelo', 'Brendel López Matheo', '58337941', '2020-09-16', 'https://ui-avatars.com/api/?name=Brendel%20L%C3%B3pez%20Matheo&background=random', 92) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_38', 'u_padre_66') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_38', 'u_padre_67') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_39', 'inst-vinculos', 'aula_vuelo', 'Coronel Emma', '58545158', '2021-05-24', 'https://ui-avatars.com/api/?name=Coronel%20Emma&background=random', 89) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_39', 'u_padre_68') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_39', 'u_padre_69') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_40', 'inst-vinculos', 'aula_vuelo', 'Fuentes Cancelarich Vera', '58337685', '2020-07-28', 'https://ui-avatars.com/api/?name=Fuentes%20Cancelarich%20Vera&background=random', 82) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_40', 'u_padre_70') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_40', 'u_padre_71') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_41', 'inst-vinculos', 'aula_vuelo', 'González Ramirez Alexis Gastón', '58243326', '2020-08-21', 'https://ui-avatars.com/api/?name=Gonz%C3%A1lez%20Ramirez%20Alexis%20Gast%C3%B3n&background=random', 99) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_41', 'u_padre_72') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_42', 'inst-vinculos', 'aula_vuelo', 'Mehrbald Boloqui Victoria', '58543074', '2021-01-06', 'https://ui-avatars.com/api/?name=Mehrbald%20Boloqui%20Victoria&background=random', 83) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_42', 'u_padre_73') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_42', 'u_padre_74') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_43', 'inst-vinculos', 'aula_vuelo', 'Saenz Ariana', '58543111', '2021-03-05', 'https://ui-avatars.com/api/?name=Saenz%20Ariana&background=random', 80) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_43', 'u_padre_75') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_43', 'u_padre_76') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_44', 'inst-vinculos', 'aula_vuelo', 'Sánchez Fernández Miranda Xairo', '58711210', '2021-02-17', 'https://ui-avatars.com/api/?name=S%C3%A1nchez%20Fern%C3%A1ndez%20Miranda%20Xairo&background=random', 98) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_44', 'u_padre_77') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_44', 'u_padre_78') ON CONFLICT DO NOTHING;
INSERT INTO students (id, institution_id, aula_id, name, dni, birth_date, avatar, attendance_rate) VALUES ('u_estudiante_45', 'inst-vinculos', 'aula_vuelo', 'Tórtola Torres Sofía', '58337939', '2020-09-12', 'https://ui-avatars.com/api/?name=T%C3%B3rtola%20Torres%20Sof%C3%ADa&background=random', 93) ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_45', 'u_padre_79') ON CONFLICT DO NOTHING;
INSERT INTO student_parents (student_id, parent_id) VALUES ('u_estudiante_45', 'u_padre_80') ON CONFLICT DO NOTHING;

INSERT INTO events (id, institution_id, title, start_date, end_date, type, color, creator_id, description, shared_with_scope) VALUES ('e_vinculos', 'inst-vinculos', 'Acto Patrio', '2026-03-04T13:00:00.000Z', '2026-03-04T15:00:00.000Z', 'ACTOS', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'u_staff_3', 'Acto general con participación de todas las salas.', 'ALL') ON CONFLICT DO NOTHING;

INSERT INTO feed_items (id, institution_id, course_id, type, scope, title, description, posted_at, author_name, material_type, url) VALUES ('f1', 'inst-vinculos', 'c_pickler', 'MATERIAL', 'COURSE', 'PDF: Metodología Pickler Básica', 'Material de lectura obligatoria.', '2026-03-04T16:02:19.481Z', 'Seila Ayala', 'PDF', '#') ON CONFLICT DO NOTHING;
INSERT INTO feed_items (id, institution_id, course_id, type, scope, title, description, posted_at, author_name, material_type, url) VALUES ('f2', 'inst-vinculos', 'c_pickler', 'MATERIAL', 'COURSE', 'Video Introductorio', 'Enlace a YouTube con la charla inicial.', '2026-03-04T15:02:19.481Z', 'Romina Ayala', 'LINK', 'https://youtube.com') ON CONFLICT DO NOTHING;

INSERT INTO communications (id, institution_id, type, title, content, sender_id, sender_name, created_at, is_read) VALUES ('comm_vinculos_1', 'inst-vinculos', 'ANUNCIO_GENERAL', 'Bienvenida al nuevo ciclo', 'Les damos una cálida bienvenida a todas las familias.', 'u_staff_3', 'Directora', '2026-03-04T16:02:19.481Z', TRUE) ON CONFLICT DO NOTHING;

