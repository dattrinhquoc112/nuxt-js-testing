import type { RequestLogPayload } from '@/stores/interface/requestSerialize/log';

class Log {
  private level;

  private applicationSide;

  private req;

  private res;

  constructor({ level, applicationSide, req, res }: RequestLogPayload) {
    this.level = level;
    this.applicationSide = applicationSide;
    this.req = req;
    this.res = res;
  }

  serialize() {
    return {
      level: this.level,
      applicationSide: this.applicationSide,
      req: this.req,
      res: this.res,
    };
  }
}

export default Log;
