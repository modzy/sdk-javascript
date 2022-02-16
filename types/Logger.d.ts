import { LoggingLevel } from "./types";
export declare class Logger {
    readonly level: number;
    constructor(loggingLevel?: LoggingLevel);
    debug(...message: any): void;
    info(...message: any): void;
    error(...message: any): void;
}
