create table transaction (
  id uuid default gen_random_uuid() primary key,
  item_id uuid not null,
  item_name text not null,
  item_price numeric not null,
  buyer_id integer not null,
  buyer_nickname text,
  buyer_avatar_url text,
  seller_id integer not null,
  seller_nickname text,
  seller_avatar_url text,
  created_at timestamptz default now() not null,
  completed_at timestamptz default null,
  cancelled_at timestamptz default null
);

insert into transaction (item_id, item_name, item_price, buyer_id, buyer_nickname, buyer_avatar_url, seller_id, seller_nickname, seller_avatar_url, completed_at, cancelled_at) values
('10f33906-24df-449d-b4fb-fcc6c76606b6', 'test', 10, 1, 'me', 'https://example.com/me.jpg', 2, 'someone', 'https://example.com/someone.jpg', null, null),
('0e80d1ea-142d-4456-af29-34c4628bace3', 'test', 10, 1, 'me', 'https://example.com/me.jpg', 2, 'someone', 'https://example.com/someone.jpg', null, now()),
('95092868-e35d-46b9-a873-e44cb938e674', 'test', 10, 2, 'someone', 'https://example.com/someone.jpg', 1, 'me', 'https://example.com/me.jpg', now(), null),
('4515e8cd-2a8b-440a-9e3c-8a57b80724d1', 'test', 10, 2, 'someone', 'https://example.com/someone.jpg', 3, 'foo', 'https://example.com/foo.jpg', null, null);
