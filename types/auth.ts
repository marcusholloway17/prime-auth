import { InjectionToken } from '@angular/core';
import { AuthService } from '../services/auth.service';

export type SignInDataType = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpDataType = {
  email: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
};

export type forgottenPasswordDataType = {
  username: string;
};

export type resetPasswordDataType = {
  password: string;
  confirmPassword: string;
  token: string;
  otp: string;
};

export type changePasswordDataType = {
  password: string;
  newPassword: string;
  confirmPassword: string;
};

export type checkPasswordDataType = {
  password: string;
};

export type OtpDataType = {
  token: string;
  otp: string;
};

export type resendOtpDataType = {
  token: string;
};

export interface AuthenticatedDataType {
  authenticated: boolean;
  authToken: string;
  idToken: string;
  id: string;
  name: string;
  username: string;
  email: string;
  provider: AuthProviderType;
  scopes: string[];
  response: any;
  application: SignInResultApplicationType;
  lastActivity?: string;
  expires_at: string;
}

export interface UnauthenticatedDataType {
  authenticated: boolean;
  msg: string;
}

export interface TwoFactorAuthenticationDataType {
  is2faEnabled: boolean;
  auth2faToken: string;
}
export interface OneTimePasswordDataType {
  token: boolean;
  msg: string;
}

export interface CheckOtpResponseType {
  valid: boolean;
}

export type AccountVerifiedType = {
  success: boolean;
  authToken: string;
  msg: string;
};

export type resetPasswordResponseType = {
  success: boolean;
  msg: string;
};

export type SignInResult =
  | AuthenticatedDataType
  | UnauthenticatedDataType
  | TwoFactorAuthenticationDataType;

export type SignInResultApplicationType = {
  key: string;
  name: string;
};

export interface BadRequestType {
  errors: badRequestErrorType[];
}

export type badRequestErrorType = {
  msg: string;
  params?: string;
  code?: string;
  location?: string;
};

export type AuthProviderType = 'LOCAL' | 'GOOGLE';

export type AuthStateType = {
  performingAction: boolean;
  data?: any;
  msg?: string | BadRequestType;
};

export type UserStateType = {
  id: string;
  scopes: string[];
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  birthdate?: string;
  birthplace?: string;
  gender?: string;
  address?: string;
  bio?: string;
  country?: string;
  city?: string;
  region?: string;
  profilePictureUrl?: string;
  locale: string;
  details?: string;
  recoveryEmail?: string;
  recoveryToken?: string;
  accessToken?: string;
  refreshToken?: string;
  verified: boolean;
  is2faEnabled: boolean;
  provider: AuthProviderType;
  isDeveloper: boolean;
  active: boolean;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
};

export type UserDataType = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  birthdate?: string;
  birthplace?: string;
  gender?: string;
  address?: string;
  bio?: string;
  country?: string;
  city?: string;
  region?: string;
  profilePictureUrl?: string;
  locale: string;
  details?: string;
  recoveryEmail?: string;
  recoveryToken?: string;
  accessToken?: string;
  refreshToken?: string;
  verified: boolean;
  is2faEnabled: boolean;
  provider: AuthProviderType;
  isDeveloper: boolean;
  active: boolean;
  lastActivity?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt: string;
};

export type AuthConfigType = {
  apiHost: string;
  appHost: string;
  clientId: string;
  clientSecret: string;
  redirectTo: string;
};

export const AUTH_CONFIG_PROVIDER = new InjectionToken<AuthConfigType>(
  'AUTH CONFIG PROVIDER'
);

export const AUTH_SERVICE = new InjectionToken<AuthService>(
  'AuthServiceInterface instance injection token'
);
