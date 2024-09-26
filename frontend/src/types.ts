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
  phone: string | null;
  preferred_currency: string | null;
  created_at: string;
  deleted_at: string | null;
};
