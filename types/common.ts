export interface ITenant {
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
    description: any;
  };
  industryTypeName: string;
  orgSizeName: string;
}

export type IItemOption = { text: string; value: any };
export interface IFormPassword {
  value: string;
  valueConfirm?: string;
  checked?: boolean;
}
export interface INameAndTel {
  firstName: string | null;
  lastName: string | null;
  firstTel: { text: string; value: number | null | string };
  lastTel: string | null;
}
export interface ITenantInfo {
  tenantName: string;
  companyName: string;
  industry: IItemOption | null;
  size: IItemOption | null;
  country: IItemOption | null;
}
export interface IUserNameAndAvatar {
  userName: string;
  avatar: string | null;
  fileInput: File | null;
}
export interface IRoleOption {
  text: string;
  value: number;
  nameRole?: string;
}
export interface IPermission {
  isOwner: boolean;
  isAdmin: boolean;
  isAssistantAdmin: boolean;
  isMySelf?: boolean;
  isAllow?: boolean;
  isUser?: boolean;
}
export interface ILabelElement {
  isButtonHref: boolean;
  isBorderAudio: boolean;
  borderSection: boolean;
  isLogo: boolean;
  isImageRightSection: boolean;
  isElementRest: boolean;
  isHeader: boolean;
  isFooter: boolean;
}
