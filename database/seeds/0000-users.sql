INSERT INTO users (username, first_name, last_name, email, password)
VALUES ('jdoe', 'John', 'Doe', 'jdoe@example.com',
        '6f28ca367edb6355217d74476f4a98e45ea5a5e860425f6c0611607cc86f23fe9b996c0e0607c55533f98643ded85bf3bfc1aaafc46b5e7d78e03c21be5d6309.c92e0c6cab7e44cafbc6610c88a6ea95')
ON CONFLICT DO NOTHING;