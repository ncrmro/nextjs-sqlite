INSERT INTO users (username, first_name, last_name, email)
VALUES ('jdoe', 'John', 'Doe', 'jdoe@example.com')
ON CONFLICT DO NOTHING;