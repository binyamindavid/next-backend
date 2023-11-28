export interface LoginData {
  email: string;
  password: string;
  password_confirm: string;
}

export interface PasswordData {
  password: string;
  password_confirm: string;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  password: string;
}
