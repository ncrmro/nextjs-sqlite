WITH u AS (SELECT id
           FROM users
           WHERE email = 'jdoe@example.com')
INSERT
INTO posts (user_id, title, slug, body)
VALUES ((SELECT id FROM u), 'Hello World', 'hello-world', '# Section 1\n Hello')
ON CONFLICT DO NOTHING;