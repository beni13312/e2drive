create table users(
  id int generated always as identity primary key,
  email text not null unique,
  password text not null,
  name text not null,
  created_at timestamptz default current_timestamp
);

create table sessions (
  id int generated always as identity primary key,
  user_id int not null references users(id),
  token text not null unique,
  expires_at timestamptz not null
);

create table folders(
  id bigint generated always as identity primary key,
  owner_id int not null references users(id) on delete cascade,
  parent_id bigint,
  encrypted_name bytea not null,
  size bigint not null default 0,
  modified_at timestamptz default current_timestamp,
  unique (owner_id, id),
  foreign key (owner_id, parent_id)
    references folders(owner_id, id) on delete cascade
);

create table files(
  id bigint generated always as identity primary key,
  owner_id int not null references users(id) on delete cascade,
  parent_id bigint,
  encrypted_name bytea not null,
  size bigint not null,
  modified_at timestamptz default current_timestamp,
  unique (owner_id, id),
  foreign key (owner_id, parent_id)
      references folders(owner_id, id) on delete cascade
);

create index folders_parent_idx on folders (owner_id, parent_id);
create index files_parent_idx on files (owner_id, parent_id);
