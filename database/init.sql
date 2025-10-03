-- Database initialization script for DSA Tracker
-- This script runs automatically when the PostgreSQL container starts

-- Create the database if it doesn't exist (handled by POSTGRES_DB env var)

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The application will handle table creation via JPA/Hibernate
-- This script can be extended to add initial data or specific configurations

-- Example: Insert some sample topics if needed
-- INSERT INTO question_topics (question_id, topic) VALUES 
-- (1, 'Array'),
-- (1, 'Dynamic Programming'),
-- (2, 'Tree'),
-- (2, 'Binary Search');

-- Add any other initialization queries here
COMMENT ON DATABASE dsatracker IS 'DSA Tracker Application Database';