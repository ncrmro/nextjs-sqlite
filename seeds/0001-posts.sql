WITH u AS (SELECT id
           FROM users
           WHERE email = 'jdoe@example.com')
INSERT
INTO posts (user_id, title, body)
VALUES ((SELECT id FROM u), 'Hello World', '# Section 1\n Hello');