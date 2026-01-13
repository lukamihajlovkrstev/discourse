export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Channel {
  channel: string;
  title: string;
  joined_at: Date;
  is_owner: boolean;
}

export interface Member {
  user: string;
  name: string;
  picture: string | null;
  joined_at: Date;
  is_owner: boolean;
}
