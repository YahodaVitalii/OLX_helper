import { JwtPayload } from '../api/auth/jwt-payload.interface';

export interface RequestUserContext {
  user: JwtPayload;
}
