CREATE DATABASE database_information_system;

USE database_information_system;

-- USERS TABLE
CREATE TABLE users(
    id INT(11) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    birthday DATE NOT NULL,
    phone INT(30) NOT NULL
);

ALTER TABLE users
    ADD PRIMARY KEY (id);

ALTER TABLE users
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 1;

DESCRIBE users;