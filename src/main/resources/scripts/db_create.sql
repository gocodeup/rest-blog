CREATE DATABASE if not exists blog_db;

CREATE USER casey_blog@localhost IDENTIFIED BY 'codeup12';

GRANT ALL ON blog_db.* TO casey_blog@localhost;


CREATE TABLE roles
(
    id   TINYINT     NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE statuses
(
    id   TINYINT     NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE users
(
    id        BIGINT      NOT NULL AUTO_INCREMENT,
    username  VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(200) NOT NULL,
    role_id   TINYINT     NOT NULL,
    status_id TINYINT     NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (status_id) REFERENCES statuses (id)
);

CREATE TABLE posts
(
    id      BIGINT       NOT NULL AUTO_INCREMENT,
    user_id BIGINT       NOT NULL,
    title   VARCHAR(100) NOT NULL,
    content TEXT         NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE tags
(
    id   INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (id)
);

CREATE TABLE post_tags
(
    id BIGINT NOT NULL AUTO_INCREMENT,
    post_id BIGINT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (tag_id) REFERENCES tags (id)
);
