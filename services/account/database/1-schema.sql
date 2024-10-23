create table department (
  -- Department's ID.
  id int generated always as identity primary key,

  -- Department's short name, e.g. ISS, SOC.
  acronym text not null,

  -- Department's full name, e.g. Institute of Systems Science, School of Computing.
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

  -- User's WhatsApp phone country code.
  phone_code text default null,

  -- User's WhatsApp phone number.
  phone_number text default null,

  -- User's preferred display currency, in the form of ISO 4217, e.g. CNY, SGD.
  preferred_currency text default null,

  -- Registration time.
  created_at timestamptz default now() not null,

  -- Soft deletion time.
  deleted_at timestamptz default null
);

create table email_transaction (
  -- Transaction's ID.
  id text as primary key,

  -- User's EDU email address.
  email text check (email like '%@u.nus.edu') not null,

  -- Opt sent to user email.
  otp text not null,

  -- Time when the opt was sent.
  created_at timestamptz default now() not null,

  -- Time when the opt verified.
  verified_at timestamptz default null
);
