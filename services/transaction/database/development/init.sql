create table transaction (
  id uuid default gen_random_uuid() primary key,
  item_id uuid not null,
  item_name text not null,
  item_price numeric not null,
  seller_id integer not null,
  seller_nickname text,
  seller_avatar_url text,
  buyer_id integer not null,
  buyer_nickname text,
  buyer_avatar_url text,
  created_at timestamptz default now() not null,
  completed_at timestamptz default null,
  cancelled_at timestamptz default null
);
