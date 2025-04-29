import {
  LogFunctionEnum,
  type LogApplicationSideEnum,
  type LogLevelEnum,
} from '@/types/enum';

interface RecordLogCommand {
  level: LogLevelEnum;
  applicationSide: LogApplicationSideEnum;
  req?: object | null | undefined;
  res?: object | null | undefined;
}

export const recordLog = ({
  level,
  applicationSide,
  req,
  res,
}: RecordLogCommand) => {
  const logFunction = LogFunctionEnum[level] as keyof Console;
  (console[logFunction] as (message?: any, ...optionalParams: any[]) => void)(
    JSON.stringify({
      level,
      applicationSide,
      req: req || {},
      res: res || {},
    })
  );
};

export default null;
