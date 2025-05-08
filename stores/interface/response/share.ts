// Put some sharing interface / type
export interface IApiCommon {
  isSuccess: boolean;
  paging: {
    pageIndex?: number;
    pageSize?: number;
    total?: number;
    hasNext?: boolean;
    hasContent?: boolean;
    totalPages?: number;
    first?: boolean;
    last?: boolean;
  };
  error: any;
}

export interface IApiError {
  isSuccess: false;
  data: null;
  paging: null;
  error: {
    statusCode: string;
    apiErrorCode: null | string;
    message: null | string;
    errors: null | string;
  };
}

export interface ICountryCode {
  id: number;
  name: string;
  seq: string;
  isEnabled: boolean;
}
export interface ICountryAll {
  id: string;
  name: string;
  fullName: string;
  continentCode: string;
  seq: number;
  isEnabled: boolean;
}
export interface ICountryCodeResponse extends IApiCommon {
  data: ICountryCode[];
}
export interface ICountryAllResponse extends IApiCommon {
  data: ICountryAll[];
}

export enum PurposeTypeNum {
  USER_REGISTER = 'USER_REGISTER',
  USER_FORGET_PASSWORD = 'USER_FORGET_PASSWORD',
  USER_LOCK = 'USER_LOCK',
  USER_INVITE = 'USER_INVITE',
}
export enum OtpTriggerStatusEnum {
  OTP_SENT = 'OTP_SENT',
  WAIT_BEFORE_RESEND = 'WAIT_BEFORE_RESEND',
  DAILY_LIMIT_REACHED = 'DAILY_LIMIT_REACHED',
}
export interface IUserRegisterResponse extends IApiCommon {
  data: {
    id: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUri: string | null;
    mobileCountryCode: number | string | null;
    mobileNumber: string | null;
    countryId: number | string | null;
    isEmailVerified: boolean;
    isEnabled: boolean;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
    otpVerificationId: string;
    otpVerificationType: string;
    otpPurposeType: PurposeTypeNum;
    allowResendAt: string;
  };
}
export interface IOtpVerification {
  id: string;
  allowResendAt: string;
  createdAt: string;
}
export interface ICheckOTPResponse extends IApiCommon {
  data: {
    expired: boolean;
    verified: boolean;
    otpTriggerStatus: OtpTriggerStatusEnum;
    otpPurposeType: PurposeTypeNum;
    otpVerification: IOtpVerification;
  };
}
export interface IResendOTPResponse extends IApiCommon {
  data: {
    id: number;
    userId: string;
    isVerified: boolean;
    otpTriggerStatus: OtpTriggerStatusEnum;
    allowResendAt: string;
    expiresAt: string;
    createdAt: string;
    purposeTypeName: PurposeTypeNum;
    allowVerify: boolean;
  };
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatarUri: string | null;
  mobileCountryCode: number | string | null;
  mobileNumber: string | null;
  countryId: string | null;
  isEmailVerified: boolean;
  isEnabled: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUserInfoResponse extends IApiCommon {
  data: IUser;
}
export interface IPresignedUrl extends IApiCommon {
  data: {
    uploadUrl: string;
    fileKey: string;
    contentType: string | null;
  };
}

interface App {
  app: {
    id: number;
    name: string;
    avatarUri: string;
  };
  role: {
    id: number;
    name: string;
    description: string | null;
  };
  isEnabled: boolean;
}
interface ITenantUserRole {
  id: number;
  name: string;
  description: string | null;
}

export interface IMemberResponse {
  userId: number;
  name: string;
  avatarUri: string;
  email: string;
  tenantUserRole: ITenantUserRole;
  isEnabled: boolean;
  isAccepted: boolean;
  otpVerification: IOtpVerification | null;
  apps: App[];
  isShowOption?: boolean;
  isMySelf?: boolean;
}
export interface IListMemberResponse extends IApiCommon {
  data: IMemberResponse[];
}

export interface IListRoleResponse extends IApiCommon {
  data: {
    id: number;
    name: string;
    description: string | null;
  }[];
}
export interface ITenantDetail {
  id: number;
  name: string;
  alias: string;
  countryId: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  roleOfTheTenant: {
    id: number;
    name: string;
    description: string | null;
  };
  industryTypeName: string;
  orgSizeName: string;
}
export interface ITenantDetailResponse extends IApiCommon {
  data: ITenantDetail;
}
export interface IForgotPasswordResponse extends IApiCommon {
  data: {
    id: number;
    userId: string;
    otpVerificationId: string;
    isVerified: boolean;
    otpTriggerStatus: OtpTriggerStatusEnum;
    allowResendAt: string;
    expiresAt: string;
    createdAt: string;
    purposeTypeName: PurposeTypeNum;
    allowVerify: true;
  };
}
export interface IRegistrationCheckResponse extends IApiCommon {
  data: {
    invitationPending: boolean;
    registered: boolean;
  };
}

export interface IDetailMemberResponse extends IApiCommon {
  data: IMemberResponse;
}
export interface ICheckLimitResponse extends IApiCommon {
  data: {
    type: string;
    limit: number;
  }[];
}
