export enum UnleashFlagNameEnum {
  EXAMPLE_FLAG = 'example_flag',
}

export enum LogLevelEnum {
  FATAL = 'FATAL',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  TRACE = 'TRACE',
}

export enum LogApplicationSideEnum {
  CLIENT = 'client',
  SERVER = 'server',
}

export enum LogFunctionEnum {
  FATAL = 'error',
  ERROR = 'error',
  WARNING = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  SYSTEM_EDITOR = 'SYSTEM_EDITOR',
  SYSTEM_VIEWER = 'SYSTEM_VIEWER',
  TENANT_OWNER = 'TENANT_OWNER',
  TENANT_ADMIN = 'TENANT_ADMIN',
  TENANT_ASSISTANT_ADMIN = 'TENANT_ASSISTANT_ADMIN',
  TENANT_USER = 'TENANT_USER',
  APP_EDITOR = 'APP_EDITOR',
  APP_VIEWER = 'APP_VIEWER',
}
