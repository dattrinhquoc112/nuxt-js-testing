import type { LogApplicationSideEnum, LogLevelEnum } from '@/types/enum';

export interface RequestLogPayload {
  level: LogLevelEnum;
  applicationSide: LogApplicationSideEnum;
  req?: object | null | undefined;
  res?: object | null | undefined;
}
