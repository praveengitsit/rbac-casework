import { ExtendedUser } from '../../user-management/models/users';

export interface AuthResponse {
  accessToken?: string;
  message?: string;
  user?: ExtendedUser;
}
