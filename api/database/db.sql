create table users(
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text not null,
  created_at timestamptz default current_timestamp
);

create table sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  token text not null unique,
  expires_at timestamptz not null
);

create table folders(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  parent_id uuid,
  encrypted_name bytea not null,
  size bigint not null default 0,
  modified_at timestamptz default current_timestamp,
  unique (owner_id, id),
  foreign key (owner_id, parent_id)
    references folders(owner_id, id) on delete cascade
);

create table files(
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  parent_id uuid,
  encrypted_name bytea not null,
  size bigint not null,
  modified_at timestamptz default current_timestamp,
  unique (owner_id, id),
  foreign key (owner_id, parent_id)
      references folders(owner_id, id) on delete cascade
);

create index folders_parent_idx on folders (owner_id, parent_id);
create index files_parent_idx on files (owner_id, parent_id);
