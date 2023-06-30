DROP TABLE IF EXISTS posts;
CREATE TABLE posts
(
    id         int PRIMARY KEY,
    user_id    int                                 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (rowid)
);