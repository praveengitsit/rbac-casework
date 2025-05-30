export interface User {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  email: string;
  phone?: string;
  department?: string;
  role: string;
}

export interface ExtendedUser extends User {
  permissions: string[];
}
