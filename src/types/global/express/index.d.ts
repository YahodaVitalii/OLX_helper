import { RequestUserContext } from '../../req-user-context.interface';

declare global {
  namespace Express {
    interface Request {
      context: RequestUserContext;
    }
  }
}
export {};
