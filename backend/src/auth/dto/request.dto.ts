import type { Request } from 'express';
import { AuthUser } from '../../common/types/auth-user.type';

export class AuthenticatedRequest extends Request {
  user: AuthUser;
}
