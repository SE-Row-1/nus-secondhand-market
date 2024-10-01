export type Department = {
  id: number;
  acronym: string;
  name: string;
};

export type Account = {
  id: number;
  email: string;
  nickname: string | null;
  avatar_url: string | null;
  department: Department | null;
  phone_code: string | null;
  phone_number: string | null;
  preferred_currency: string | null;
  created_at: string;
  deleted_at: string | null;
};
