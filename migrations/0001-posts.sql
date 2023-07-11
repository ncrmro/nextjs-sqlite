DROP TABLE IF EXISTS posts;
CREATE TABLE posts
(
    id           text                                NOT NULL PRIMARY KEY DEFAULT (uuid()),
    user_id      int                                 NOT NULL,
    title        text                                NOT NULL UNIQUE,
    body         text                                NOT NULL,
    slug         text UNIQUE,
    published    integer   DEFAULT FALSE,
    publish_date TIMESTAMP,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX posts_user
    ON posts (user_id);

CREATE INDEX posts_published
    ON posts (published);

CREATE TRIGGER posts_insert_timestamp_trigger
    AFTER INSERT
    ON posts
BEGIN
    UPDATE posts SET created_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;


CREATE TRIGGER posts_update_timestamp_trigger
    AFTER UPDATE
    ON posts
BEGIN
    UPDATE posts SET created_at = old.created_at AND updated_at = CURRENT_TIMESTAMP WHERE id = new.id;
END;

CREATE TRIGGER posts_insert_slugify_title
    AFTER INSERT
    ON posts
BEGIN
    UPDATE posts SET slug = slugify(title);
END;


CREATE TRIGGER posts_update_slugify_title
    AFTER UPDATE
    ON posts
BEGIN
    UPDATE posts SET slug = slugify(title);
END;