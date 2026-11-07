-- test user
-- password hashed with argon2id: test123
-- db: app
-- db user: dev

insert into users (email, password, name) VALUES ('test@test.com', '$argon2id$v=19$m=65536,t=3,p=4$yyp+UxPKr1WsmIzhGQ4JmQ$vf4QxZy0ntOvxxnrXMG9/ILlg4VakpOZDshaBv1UZSg', 'Test John');


-- insert into root folder
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010201', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010202', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010203', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010204', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010205', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010206', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010207', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010208', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010209', 100);
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c01020a', 100);
insert into folders (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1bff', 0);

-- insert into non-root folder
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, 1, '\x1b2c01020a', 100);
insert into folders (owner_id, parent_id, encrypted_name, size) VALUES (1, 1, '\x1bff', 0);

