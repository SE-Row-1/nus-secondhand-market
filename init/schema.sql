create table department (
  -- Department's ID.
  id int generated always as identity primary key,

  -- Department's acronym, e.g. ISS, SoC
  acronym text not null,

  -- Department's name, e.g. Institute of System Science, School of Computing.
  name text not null
);

create table account (
  -- User's ID.
  id int generated always as identity primary key,

  -- User's EDU email address.
  email text check (email like '%@u.nus.edu') not null unique,

  -- Password is stored in its hashed version, so that hackers never know the real password.
  password_hash text not null,

  -- A randomly generated short string. password_hash = SHA256(password + password_salt)
  password_salt text not null,

  -- User's preferred nickname, displayed to the public.
  nickname text default null check (char_length(nickname) between 2 and 20),

  -- URL of user's avatar, stored in S3.
  avatar_url text default null check (avatar_url like 'https://%'),

  -- Department or school of the user.
  department_id int default null references department(id) on delete set null,

  -- User's phone number. This is currently solely used for transaction contact,
  -- i.e. buyers are redirected to https://wa.me/:phone?text=I%20am%20interested%20, for example.
  phone text default null,

  -- User's preferred display currency, in the form of ISO 4217, e.g. CNY, SGD.
  preferred_currency text default null,

  -- Registration time.
  created_at timestamptz default now() not null,

  -- Soft deletion time.
  deleted_at timestamptz default null
);

create type item_status as enum ('for sale', 'dealt', 'sold', 'taken down');

create table item (
  -- Item's ID.
  id int generated always as identity primary key,

  -- Publisher of this item.
  -- If the publisher deletes his/her account, this column is set back to null.
  account_id int references account(id) on delete set null,

  -- Item's display name.
  name text check (char_length(name) between 1 and 30) not null,

  -- Item's description.
  description text default null check (char_length(description) between 1 and 200),

  -- Item's price in SGD.
  price numeric check (price > 0) not null,

  -- List of URLs of the item's photo, stored in S3.
  photo_urls text[] default '{}',

  -- This is a redundant column. It is here to optimize performance.
  -- Because otherwise, when retrieving items for browsing,
  -- backend has to verify each item whether it belongs to a pack or not.
  is_packed boolean default false not null,

  -- Item's status.
  status item_status default 'for sale',

  -- Published time.
  created_at timestamptz default now() not null,

  -- Soft deletion time.
  deleted_at timestamptz default null
);

create table wishlist (
  -- Who wants this item.
  account_id int references account(id),

  -- Which item he/she wants.
  item_id int references item(id),

  -- When this user wants this item.
  created_at timestamptz default now() not null,

  -- Account ID and item ID together identifies an wishlist entry.
  primary key (account_id, item_id)
);

create table item_pack (
  -- Item pack's ID.
  id int generated always as identity primary key,

  -- Publisher of this item pack.
  -- If the publisher deletes his/her account, this column is set back to null.
  account_id int references account(id) on delete set null,

  -- Item pack's display name.
  -- If null, the pack will be displayed as "Pack of XXX, XXX, XXX".
  name text default null check (char_length(name) between 1 and 30),

  -- Percentage of discount, e.g. 0.2 means the item pack's price is 80% of all items combined.
  discount numeric default 0 check (discount between 0 and 1) not null,

  -- Basic information of items contained within.
  item_summaries jsonb default '[]',

  -- Packed time.
  created_at timestamptz default now() not null,

  -- Soft deletion time.
  deleted_at timestamptz default null
);

