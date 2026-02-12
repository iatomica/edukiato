
-- CLEANUP
TRUNCATE institutions, users, user_institution_roles, academic_terms, courses, enrollments, class_sessions, attendance_records, assignments, submissions, payments CASCADE;

-- 0. INSTITUTIONS (Tenants) --
INSERT INTO institutions (id, name, slug, logo_url, primary_color, secondary_color, plan) VALUES
('a0000000-0000-0000-0000-000000000001', 'Instituto de Arte Contemporáneo', 'arte-contemporaneo', 'https://picsum.photos/seed/inst1/200', '#14b8a6', '#0f766e', 'PRO'),
('a0000000-0000-0000-0000-000000000002', 'Escuela de Música Moderna', 'musica-moderna', 'https://picsum.photos/seed/inst2/200', '#6366f1', '#4f46e5', 'PRO');

-- 1. USERS (Hardcoded IDs for relationships) --

-- Admin
INSERT INTO users (id, full_name, email, password_hash, bio, avatar_url) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alex Rivera', 'admin@edukiato.edu', 'hashed_pass', 'Director of Edukiato Institute. Passionate about community education.', 'https://picsum.photos/seed/alex/200');

-- Teachers
INSERT INTO users (id, full_name, email, password_hash, bio, avatar_url) VALUES 
('t1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11', 'Elena Fisher', 'elena@edukiato.edu', 'hashed_pass', 'Ceramicist with 15 years experience. Loves organic forms.', 'https://picsum.photos/seed/elena/200'),
('t2eebc99-9c0b-4ef8-bb6d-6bb9bd380t22', 'Marcus Cole', 'marcus@edukiato.edu', 'hashed_pass', 'Jazz pianist and composer. Believes in strict rhythm and loose melody.', 'https://picsum.photos/seed/marcus/200');

-- Students
INSERT INTO users (id, full_name, email, password_hash, bio, avatar_url) VALUES 
('s1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'Sofia Chen', 'sofia@student.com', 'hashed_pass', 'Visual arts student looking to expand into 3D mediums.', 'https://picsum.photos/seed/sofia/200'),
('s2eebc99-9c0b-4ef8-bb6d-6bb9bd380s22', 'Liam O''Connor', 'liam@student.com', 'hashed_pass', 'Drummer. Always tapping on things.', 'https://picsum.photos/seed/liam/200'),
('s3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'Maya Patel', 'maya@student.com', 'hashed_pass', 'Hobbyist photographer and pottery enthusiast.', 'https://picsum.photos/seed/maya/200');

-- 1b. USER-INSTITUTION ROLES --
-- Alex: ADMIN at Arte, TEACHER at Música
INSERT INTO user_institution_roles (user_id, institution_id, role) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000000001', 'ADMIN_INSTITUCION'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0000000-0000-0000-0000-000000000002', 'DOCENTE');
-- Elena: DOCENTE at Arte
INSERT INTO user_institution_roles (user_id, institution_id, role) VALUES
('t1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11', 'a0000000-0000-0000-0000-000000000001', 'DOCENTE');
-- Marcus: DOCENTE at Arte
INSERT INTO user_institution_roles (user_id, institution_id, role) VALUES
('t2eebc99-9c0b-4ef8-bb6d-6bb9bd380t22', 'a0000000-0000-0000-0000-000000000001', 'DOCENTE');
-- Sofia, Liam, Maya: ESTUDIANTES at Arte
INSERT INTO user_institution_roles (user_id, institution_id, role) VALUES
('s1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'a0000000-0000-0000-0000-000000000001', 'ESTUDIANTE'),
('s2eebc99-9c0b-4ef8-bb6d-6bb9bd380s22', 'a0000000-0000-0000-0000-000000000001', 'ESTUDIANTE'),
('s3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'a0000000-0000-0000-0000-000000000001', 'ESTUDIANTE');

-- 2. ACADEMIC TERMS --
INSERT INTO academic_terms (id, name, start_date, end_date, is_active) VALUES
('term1-uuid-0000-0000-000000000000', 'Spring Workshop Series 2024', '2024-03-01', '2024-06-30', TRUE);

-- 3. COURSES --
INSERT INTO courses (id, term_id, teacher_id, title, description, location, schedule_text, capacity, price, status, cover_image_url) VALUES
-- Ceramics Course
('c1-uuid-0000-0000-000000000001', 'term1-uuid-0000-0000-000000000000', 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11', 
 'Intro to Wheel Throwing', 
 'A hands-on introduction to the potter''s wheel. We will focus on centering, opening, and pulling walls to create cylinders and bowls.',
 'Studio B (Basement)', 'Mon/Wed 18:00', 8, 350.00, 'IN_PROGRESS', 'https://images.unsplash.com/photo-1565193566173-7a64c27876e9?auto=format&fit=crop&q=80&w=400'),

-- Jazz Course
('c2-uuid-0000-0000-000000000002', 'term1-uuid-0000-0000-000000000000', 't2eebc99-9c0b-4ef8-bb6d-6bb9bd380t22', 
 'Jazz Improvisation Ensemble', 
 'Learn to listen and respond in a group setting. Focus on modal jazz and bebop standards.',
 'Music Room 1', 'Tue 19:00', 12, 200.00, 'OPEN', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=400');

-- 4. ENROLLMENTS --
INSERT INTO enrollments (course_id, student_id) VALUES
('c1-uuid-0000-0000-000000000001', 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11'), -- Sofia in Ceramics
('c1-uuid-0000-0000-000000000001', 's3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33'), -- Maya in Ceramics
('c2-uuid-0000-0000-000000000002', 's2eebc99-9c0b-4ef8-bb6d-6bb9bd380s22'); -- Liam in Jazz

-- 5. CLASS SESSIONS (Sample for Ceramics) --
INSERT INTO class_sessions (id, course_id, title, start_time, end_time, location, notes) VALUES
('sess1-uuid-0000-0000-000000000001', 'c1-uuid-0000-0000-000000000001', 'Centering Clay', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '2 hours', 'Studio B', 'Wear clothes you do not mind getting dirty!'),
('sess2-uuid-0000-0000-000000000002', 'c1-uuid-0000-0000-000000000001', 'Opening the Mound', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 'Studio B', 'Bring your own towel.');

-- 6. ATTENDANCE --
INSERT INTO attendance_records (session_id, student_id, status, remarks) VALUES
('sess1-uuid-0000-0000-000000000001', 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'PRESENT', NULL),
('sess1-uuid-0000-0000-000000000001', 's3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'LATE', 'Arrived 15 mins late due to traffic');

-- 7. ASSIGNMENTS --
INSERT INTO assignments (id, course_id, title, description, due_date, is_group_project) VALUES
('a1-uuid-0000-0000-000000000001', 'c1-uuid-0000-0000-000000000001', 'The Cylinder Challenge', 'Throw 3 identical cylinders at least 6 inches tall.', NOW() + INTERVAL '1 week', FALSE);

-- 8. SUBMISSIONS --
INSERT INTO submissions (assignment_id, student_id, content_text, attachment_url, status, grade_score, feedback_text, graded_by, graded_at) VALUES
('a1-uuid-0000-0000-000000000001', 's1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'Here are photos of my cylinders. The second one wobbled a bit.', 'http://example.com/cylinder.jpg', 'GRADED', 85, 'Great height! Focus on keeping the rim consistent.', 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11', NOW());

-- 9. ANNOUNCEMENTS --
INSERT INTO announcements (course_id, author_id, title, content) VALUES
('c1-uuid-0000-0000-000000000001', 't1eebc99-9c0b-4ef8-bb6d-6bb9bd380t11', 'Kiln Firing Schedule', 'The bisque firing will happen this Friday. Please have all greenware on the drying shelf by Thursday night.');

-- 10. PAYMENTS --
INSERT INTO payments (student_id, course_id, amount, due_date, status, description) VALUES
('s1eebc99-9c0b-4ef8-bb6d-6bb9bd380s11', 'c1-uuid-0000-0000-000000000001', 350.00, '2024-03-01', 'PAID', 'Course Tuition - Intro to Wheel Throwing'),
('s3eebc99-9c0b-4ef8-bb6d-6bb9bd380s33', 'c1-uuid-0000-0000-000000000001', 50.00, '2024-03-05', 'PENDING', 'Lab Materials Fee');