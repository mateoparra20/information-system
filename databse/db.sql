CREATE DATABASE database_information_system;

USE database_information_system;

-- USERS TABLE
CREATE TABLE users(
    id BIGINT NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    cedula BIGINT NOT NULL,
    birthday DATE NOT NULL,
    phone BIGINT NOT NULL,
    role VARCHAR(10) NOT NULL,
    gender VARCHAR(20) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id BIGINT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE users;