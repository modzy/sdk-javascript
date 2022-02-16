declare type ApiErrorConfig = {
    url?: string;
    code?: number;
    message?: string;
};
declare type CustomErrorType = {
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
export declare class ApiError {
    error: CustomErrorType | null;
    message: string;
    code: number;
    url: string;
    constructor(error: CustomErrorType | null, { url, code, message }?: ApiErrorConfig);
    toString(): string;
}
export {};
