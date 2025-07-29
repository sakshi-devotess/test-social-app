export interface ISignUp {
  first_name: string;
  last_name: string;
  email: string;
  company_id: number;
  password: string;
  confirmPassword: string;
}

export interface ILogin {
  password: string;
  username: string;
  clientType?: string;
}

export interface IChangePassword {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

export interface IResetPassword {
  token?: string;
  password: string;
  confirmPassword: string;
}
