DROP TABLE IF EXISTS users;
CREATE TABLE users
(
    id         text                                NOT NULL PRIMARY KEY DEFAULT (uuid()),
    username   text UNIQUE,
    first_name text,
    last_name  text,
    email      text                                NOT NULL UNIQUE CHECK (email REGEXP '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$'),
    image      text,
    password   text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER users_insert_timestamp_trigger
    AFTER INSERT
    ON users
BEGIN
    UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;


CREATE TRIGGER users_update_timestamp_trigger
    AFTER UPDATE
    ON users
BEGIN
    UPDATE users SET created_at = old.created_at AND updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;


DROP TABLE IF EXISTS sessions;
CREATE TABLE sessions
(
    id                 text                                NOT NULL PRIMARY KEY DEFAULT (uuid()),
    user_id            text                                NOT NULL,
    last_authenticated TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TRIGGER sessions_insert_timestamp_trigger
    AFTER INSERT
    ON sessions
BEGIN
    UPDATE sessions SET created_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;


CREATE TRIGGER sessions_update_timestamp_trigger
    AFTER UPDATE
    ON sessions
BEGIN
    UPDATE sessions SET created_at = old.created_at AND updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;