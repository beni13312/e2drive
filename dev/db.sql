
select 1 from sessions where token='3dc11845f1e348d5d232427eecf726e84268523d02517408a415a52583bb4f37' and expires_at > '2026-10-01T16:51:39.089Z'::timestamptz;


SELECT users.password_hash FROM users JOIN sessions ON sessions.user_id = users.id WHERE sessions.token='859b066d0aff65274c30d0bc021f07424116c75dd37460c2f23c5d5b10999ffb';

select users.id from users join sessions on sessions.user_id = users.id where sessions.token = 'bd7196ab7e8fa8b0f7c13504ae54c793ba31d79958d32a4fd797fb93aece3844';

-- clear tables
truncate table sessions cascade;
truncate table files cascade;
truncate table folders cascade;

-- list from root folder
select id, encrypted_name, size, modified_at from files where parent_id is null;
select id, encrypted_name, size, modified_at from folders where parent_id is null;

-- list from non-root folder
select id, encrypted_name, size, modified_at from files where parent_id=1;
select id, encrypted_name, size, modified_at from folders where parent_id=1;

-- list one folder entirely with folders and files
select id, 'file' AS type, encrypted_name, size, modified_at from files where parent_id=1
union all
select id, 'folder' AS type,encrypted_name, size, modified_at from folders where parent_id=1;

-- insert into root folder
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1b2c010201', 100);
insert into folders (owner_id, parent_id, encrypted_name, size) VALUES (1, null, '\x1bff', 0);

-- insert into non-root folder
insert into files (owner_id, parent_id, encrypted_name, size) VALUES (1, 1, '\x1b2c010201', 100);
insert into folders (owner_id, parent_id, encrypted_name, size) VALUES (1, 1, '\x1bff', 0);


select * from files;
select * from folders;



-- constructing the folder path with query
WITH RECURSIVE folderPath AS (
    SELECT id, parent_id, encrypted_name, 1 AS depth
    FROM folders
    WHERE id = '84fa90de-b8b0-4236-a0ec-b61761c1c39d'::uuid
    AND owner_id = '7162156f-2c8c-48f8-be53-bd94d4042fd6'

    UNION ALL

    SELECT f.id, f.parent_id, f.encrypted_name, fp.depth + 1
    FROM folders as f
    JOIN folderPath as fp ON f.id = fp.parent_id
    WHERE f.owner_id = '7162156f-2c8c-48f8-be53-bd94d4042fd6'
)
SELECT id, encrypted_name
FROM folderPath
ORDER BY depth DESC;
