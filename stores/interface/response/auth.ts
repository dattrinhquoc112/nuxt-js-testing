import type { IApiCommon } from './share';

export interface LoginResponseData {
  token: string;
}
export interface EmailRegistrationResponse extends IApiCommon {
  data: {
    invitationPending: boolean;
    registered: boolean;
  };
}
export interface IOauthToken {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token?: any;
  id_token?: any;
}
