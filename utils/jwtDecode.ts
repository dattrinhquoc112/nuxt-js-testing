import jwtDecode from 'jwt-decode';
import type { CustomJwtPayload } from '@/interface/JwtPayload';

export default (token: string) => {
  if (token) return jwtDecode<CustomJwtPayload>(token);
  return null;
};
