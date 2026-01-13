CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    email text,
    name text,
    picture text,
    created_at timestamp,
    updated_at timestamp
);
