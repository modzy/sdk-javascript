type ApiErrorConfig = {
  url?: string;
  code?: number;
  message?: string;
};

type CustomErrorType = {
  message: string;
  response: {
    data: {
      message: string;
      statusCode: number;
    };
  };
  config: {
    url: string;
  };
};

export class ApiError {
  error: CustomErrorType | null;
  message: string;
  code: number;
  url: string;

  constructor(
    error: CustomErrorType | null,
    { url, code = 500, message = "Unexpected" }: ApiErrorConfig = {}
  ) {
    this.message =
      message ||
      error?.response?.data?.message ||
      error?.message ||
      "no message";
    this.code = code || error?.response?.data?.statusCode || 0;
    this.url = url || error?.config?.url || "no url";
    this.error = error;
  }

  toString() {
    return `${this.code} :: ${this.message} :: ${this.url}`;
  }
}
