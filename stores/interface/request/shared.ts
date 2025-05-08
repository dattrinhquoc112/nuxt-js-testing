export interface IUsersRegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  mobileCountryCode?: number | string;
  mobileNumber?: string;
  otpVerificationId?: string;
  otpVerificationCode?: string;
}

export interface RequestUpdatePayload {
  avatarFileKey?: string;
  username?: string;
  firstName?: string | null;
  lastName?: string | null;
  mobileCountryCode?: number | string | null;
  mobileNumber?: number | string | null;
  currentPassword?: string;
  newPassword?: string;
}
export interface RequestTenantPayload {
  alias: string;
  name: string;
  industryType: string;
  orgSize: string;
  countryId: string;
}
export enum TypeRole {
  SYSTEM_ROLE = 'SYSTEM_ROLE',
  TENANT_ROLE = 'TENANT_ROLE',
  APP_ROLE = 'APP_ROLE',
}

export interface RequestAcceptInvitationPayload {
  otpVerificationId: string;
  otpVerificationCode: string;
}
export interface RequestUserTenantPayload {
  roleType?: string;
  condition?: string;
  page: number;
  size: number;
}
