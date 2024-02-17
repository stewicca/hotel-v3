export interface AppErrorInfo {
  message: string,
  context?: {
    public?: any,
    private?: any
  };
};

export class AppError extends Error {
  public statusCode: number;
  public context: any;

  constructor(statusCode: number, info: AppErrorInfo) {
    super(info.message);
    this.name = this.constructor.name;
    this.statusCode = statusCode ?? 500;
    this.context = info.context;
  };
};
