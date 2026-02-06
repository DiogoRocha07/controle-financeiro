import type { Request } from 'express';
import { AuthUser } from '../types/auth-user.type';

export class AuthenticatedRequest extends Request {
  user: AuthUser;
}
