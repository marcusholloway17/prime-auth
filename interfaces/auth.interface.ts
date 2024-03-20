import { Observable } from 'rxjs';
import {
  AuthenticatedDataType,
  SignInDataType,
  SignUpDataType,
  TwoFactorAuthenticationDataType,
  UnauthenticatedDataType,
  BadRequestType,
  changePasswordDataType,
  checkPasswordDataType,
  forgottenPasswordDataType,
  resetPasswordDataType,
  OtpDataType,
  AccountVerifiedType,
} from '../types';

export interface IAuthInterface {
  signInState$: Observable<AuthenticatedDataType>;
  signIn(
    data: SignInDataType
  ): Observable<
    | AuthenticatedDataType
    | UnauthenticatedDataType
    | TwoFactorAuthenticationDataType
  >;
  signUp(data: SignUpDataType): Observable<TwoFactorAuthenticationDataType>;
  verifyAccount(
    data: OtpDataType
  ): Observable<AccountVerifiedType | BadRequestType>;
  forgottenPassword(
    data: forgottenPasswordDataType
  ): Observable<TwoFactorAuthenticationDataType | BadRequestType>;
  resetPassword(data: resetPasswordDataType): void;
  checkOtp(data: OtpDataType): boolean;
  changePassword(data: changePasswordDataType): void;
  checkPassword(data: checkPasswordDataType): boolean;
  signOut(revoke: boolean): void;
}
