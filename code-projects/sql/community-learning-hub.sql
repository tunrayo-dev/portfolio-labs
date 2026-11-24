-- Community Learning Hub: relational schema and useful reporting queries.
-- Compatible with PostgreSQL.

CREATE TABLE IF NOT EXISTS learners (
    learner_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    joined_on DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS courses (
    course_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    category VARCHAR(80) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    learner_id BIGINT NOT NULL REFERENCES learners(learner_id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    enrolled_on DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_status VARCHAR(20) NOT NULL DEFAULT 'enrolled'
        CHECK (completion_status IN ('enrolled', 'in_progress', 'completed', 'paused')),
    UNIQUE (learner_id, course_id)
);

CREATE TABLE IF NOT EXISTS learning_sessions (
    session_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    enrollment_id BIGINT NOT NULL REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    minutes_spent INTEGER NOT NULL CHECK (minutes_spent > 0),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_enrollment_date
    ON learning_sessions(enrollment_id, session_date);

-- 1. Learner count and active course count.
SELECT
    (SELECT COUNT(*) FROM learners) AS total_learners,
    (SELECT COUNT(*) FROM courses WHERE is_active) AS active_courses;

-- 2. Enrolments and completion rate by course.
SELECT
    c.title,
    COUNT(e.enrollment_id) AS enrolments,
    COUNT(*) FILTER (WHERE e.completion_status = 'completed') AS completed,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE e.completion_status = 'completed')
        / NULLIF(COUNT(e.enrollment_id), 0), 1
    ) AS completion_percent
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.course_id
GROUP BY c.course_id, c.title
ORDER BY enrolments DESC;

-- 3. Total learning time by learner.
SELECT
    l.full_name,
    COALESCE(SUM(s.minutes_spent), 0) AS learning_minutes
FROM learners l
LEFT JOIN enrollments e ON e.learner_id = l.learner_id
LEFT JOIN learning_sessions s ON s.enrollment_id = e.enrollment_id
GROUP BY l.learner_id, l.full_name
ORDER BY learning_minutes DESC;
