-- SQL Injection Lab - Database Schema
-- Table: users

-- Drop existing table to ensure a clean start
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Dummy Data
INSERT INTO users (name, email, password, role) VALUES
('Administrator', 'admin@lab.com', 'admin123', 'admin'),
('João Silva', 'joao@email.com', 'senha123', 'user'),
('Maria Souza', 'maria@email.com', 'mypassword', 'user'),
('Test User', 'teste@email.com', 'test', 'user');
