INSERT INTO users (username, password, email, is_admin, is_active) VALUES ('test_user', 'test123', 'test@test.com', 0, 1);

INSERT INTO posts (user_id, title, content) VALUES (1, 'Babys First Post', 'Do not be alarmed. This is only a test.');

INSERT INTO tags (name) VALUES ('test_tag');

INSERT INTO post_tags (post_id, tag_id) VALUES (1, 1);

SELECT * FROM users;

SELECT * FROM posts;
SELECT * FROM post_tags;