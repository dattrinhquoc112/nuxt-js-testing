export interface RequestLoginPayload {
  identifier: string;
  password: string;
}
export interface RequestResetPasswordPayload {
  otpVerificationId: string;
  code: string;
  newPassword: string;
}
