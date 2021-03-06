  
use heroku_a72350352312ba8;

SET @@auto_increment_increment=1;
CREATE TABLE roles (
   role_id   BIGINT NOT NULL AUTO_INCREMENT,
   role VARCHAR(20) NOT NULL,
  PRIMARY KEY (role_id)
);

SET @@auto_increment_increment=1;
CREATE TABLE users (
   user_id   BIGINT NOT NULL AUTO_INCREMENT,
   email  VARCHAR(100) NOT NULL,
   password VARCHAR(100) NOT NULL,
   name  VARCHAR(100) NOT NULL,
   lastname  VARCHAR(100) NOT NULL,
   identification   BIGINT NOT NULL,
   birthday  DATE NOT NULL,
   phone   BIGINT NOT NULL,
   role_id   BIGINT NOT NULL,
   gender  VARCHAR(20) NOT NULL,
  PRIMARY KEY (user_id),
  CONSTRAINT fk_role_users FOREIGN KEY(role_id) REFERENCES roles(role_id)
);

SET @@auto_increment_increment=1;
CREATE TABLE vital_signs (
   vs_id   BIGINT NOT NULL AUTO_INCREMENT,
   vital_sign  VARCHAR(20) NOT NULL,
  PRIMARY KEY (vs_id)
);

SET @@auto_increment_increment=1;
CREATE TABLE anomalies (
   anomaly_id  int(100) NOT NULL AUTO_INCREMENT,
   vs_id  BIGINT NOT NULL,
   max_rate  float NOT NULL,
   min_rate  float NOT NULL,
   gender  VARCHAR(20) NOT NULL,
   age  int(100) NOT NULL,
   description  VARCHAR(100) NOT NULL,
  PRIMARY KEY (anomaly_id),
  CONSTRAINT fk_vs_anom FOREIGN KEY(vs_id) REFERENCES vital_signs(vs_id)
);

SET @@auto_increment_increment=1;
CREATE TABLE  alert_history  (
   alert_hist_id  int NOT NULL AUTO_INCREMENT,
   time_record  datetime NOT NULL,
   user_id  BIGINT NOT NULL,
   anomaly_id  int(100) NOT NULL,
  PRIMARY KEY (alert_hist_id),
  CONSTRAINT fk_user_hist FOREIGN KEY(user_id) REFERENCES users(user_id),
  CONSTRAINT fk_anom_hist FOREIGN KEY(anomaly_id) REFERENCES anomalies(anomaly_id)
);

SET @@auto_increment_increment=1;
CREATE TABLE  vital_signs_users  (
   vs_user_id   BIGINT NOT NULL AUTO_INCREMENT,
   user_id  BIGINT NOT NULL,
   vs_id  BIGINT NOT NULL,
   measure  float NOT NULL,
   time_record  datetime NOT NULL,
  PRIMARY KEY (vs_user_id),
   CONSTRAINT fk_user_vsu FOREIGN KEY(user_id) REFERENCES users(user_id),
   CONSTRAINT fk_vs_vsu FOREIGN KEY(vs_id) REFERENCES vital_signs(vs_id)
);

-- Roles:
insert into roles(role) values ('user');
insert into roles(role) values ('analist');
-- Signos vitales:
insert into vital_signs(vital_sign) values ('Frecuencia Card??aca');
insert into vital_signs(vital_sign) values ('Oximetr??a') ;
insert into vital_signs(vital_sign) values ('Temperatura') ;

SET @@auto_increment_increment=1;

-- Drop all:
-- use heroku_a72350352312ba8;
-- Drop table vital_signs_users;
-- Drop table alert_history;
-- Drop table anomalies;
-- Drop table users;
-- Drop table vital_signs;
-- Drop table roles;