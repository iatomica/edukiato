
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS --
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN_INSTITUCION', 'DOCENTE', 'ESTUDIANTE');
CREATE TYPE course_status AS ENUM ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
CREATE TYPE submission_status AS ENUM ('PENDING', 'SUBMITTED', 'GRADED', 'LATE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('ANNOUNCEMENT', 'MESSAGE', 'GRADE', 'SYSTEM');
CREATE TYPE institution_plan AS ENUM ('FREE', 'PRO', 'ENTERPRISE');

-- 0. INSTITUTIONS (Tenant) --
-- Each institution is a separate tenant with its own branding.
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly identifier
    logo_url TEXT,
    primary_color VARCHAR(7) DEFAULT '#14b8a6',
    secondary_color VARCHAR(7) DEFAULT '#0f766e',
    plan institution_plan DEFAULT 'FREE',
    permission_overrides JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. USERS --
-- Single table for all users. Role is contextual per institution.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1b. USER-INSTITUTION ROLES (Many-to-Many with role context) --
-- A user can be ADMIN in one institution and TEACHER in another.
CREATE TABLE user_institution_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'STUDENT',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, institution_id)
);

-- 2. ACADEMIC TERMS --
-- Groups courses by time periods (e.g., "Spring 2024")
CREATE TABLE academic_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES --
-- The core unit. "Workshops" or "Classes".
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    term_id UUID REFERENCES academic_terms(id),
    teacher_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    schedule_text VARCHAR(100),
    capacity INTEGER DEFAULT 15,
    price DECIMAL(10, 2) DEFAULT 0.00,
    cover_image_url TEXT,
    status course_status DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ENROLLMENTS --
-- Links students to courses.
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    final_grade VARCHAR(10), -- Optional final score/letter
    certificate_url TEXT, -- Link to generated PDF if applicable
    UNIQUE(course_id, student_id)
);

-- 5. CLASS SESSIONS (CALENDAR) --
-- Specific dates for classes. Allows for irregular schedules common in arts.
CREATE TABLE class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200), -- e.g. "Intro to Glazing"
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(100), -- Overrides course location if specific
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ATTENDANCE --
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'ABSENT',
    remarks VARCHAR(255), -- e.g. "Arrived 10 mins late due to rain"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, student_id)
);

-- 7. ASSIGNMENTS (PROJECTS) --
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    is_group_project BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SUBMISSIONS & FEEDBACK --
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_text TEXT, -- For quick reflections
    attachment_url TEXT, -- For images/PDFs of the art
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status submission_status DEFAULT 'SUBMITTED',
    
    -- Evaluation
    grade_score INTEGER, -- 0-100
    feedback_text TEXT, -- Qualitative feedback is key in arts
    graded_at TIMESTAMP WITH TIME ZONE,
    graded_by UUID REFERENCES users(id),
    
    UNIQUE(assignment_id, student_id)
);

-- 9. COURSE MATERIALS (RESOURCES) --
CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    resource_type VARCHAR(50), -- 'PDF', 'VIDEO', 'LINK'
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ANNOUNCEMENTS --
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE, -- Null if global announcement
    author_id UUID REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. PAYMENTS (MANUAL) --
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    status payment_status DEFAULT 'PENDING',
    description VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. MESSAGING (Internal Communication) --
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    is_group BOOLEAN DEFAULT FALSE,
    course_id UUID REFERENCES courses(id),
    name VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE -- Simplified read receipt
);

-- 13. NOTIFICATIONS (In-App) --
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    link_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_user_inst_roles_user ON user_institution_roles(user_id);
CREATE INDEX idx_user_inst_roles_inst ON user_institution_roles(institution_id);
CREATE INDEX idx_courses_institution ON courses(institution_id);
CREATE INDEX idx_courses_term ON courses(term_id);
CREATE INDEX idx_terms_institution ON academic_terms(institution_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_sessions_course ON class_sessions(course_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_institution ON notifications(institution_id);
CREATE INDEX idx_payments_institution ON payments(institution_id);
