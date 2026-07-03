import { Client } from './client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  client: Client;
}

export interface RegisterPayload {
  email: string;
  password: string;
  businessName: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}
