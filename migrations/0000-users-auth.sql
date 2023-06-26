DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id         int PRIMARY KEY,
    username   text UNIQUE,
    first_name text,
    last_name  text,
    email      text,
    image      text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER insert_timestamp_trigger
    AFTER INSERT
    ON users
BEGIN
    UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;


CREATE TRIGGER update_timestamp_trigger
    AFTER UPDATE
    ON users
BEGIN
    UPDATE users SET created_at = old.created_at AND updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

