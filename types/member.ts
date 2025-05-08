import type { IOtpVerification } from '~/stores/interface/response/share';
import type { IRoleOption } from './common';

export interface IAppItem {
  app: {
    id: number;
    name: string;
    avatarUri: string;
  };
  role: IRoleOption;
  isEnabled: boolean;
}
export interface IDetailMember {
  userId: number;
  name: string;
  avatarUri: string;
  email: string;
  isEnabled: boolean;
  isAccepted: boolean;
  otpVerification: IOtpVerification | null;
  isShowOption?: boolean;
  tenantUserRoleClient: IRoleOption;
  apps: IAppItem[];
}
