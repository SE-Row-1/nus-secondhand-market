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

insert into transaction (item_id, item_name, item_price, seller_id, seller_nickname, seller_avatar_url, buyer_id, buyer_nickname, buyer_avatar_url, completed_at, cancelled_at) values
('10f33906-24df-449d-b4fb-fcc6c76606b6', 'item1', 10, 1, 'nickname1', 'https://example.com/avatar1.jpg', 2, 'nickname2', 'https://example.com/avatar2.jpg', null, now()),
('10f33906-24df-449d-b4fb-fcc6c76606b6', 'item1', 10, 1, 'nickname1', 'https://example.com/avatar1.jpg', 3, 'nickname3', 'https://example.com/avatar3.jpg', now(), null),
('2475bad8-43ca-4d23-99ee-224d7d9e6ba7', 'item2', 20, 1, 'nickname1', 'https://example.com/avatar1.jpg', 2, 'nickname2', 'https://example.com/avatar2.jpg', null, null),
('3aed59b0-0fa7-4b8b-b1fd-39b8f46a75b3', 'item3', 30, 1, 'nickname1', 'https://example.com/avatar1.jpg', 3, 'nickname3', 'https://example.com/avatar3.jpg', null, null);
