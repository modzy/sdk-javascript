import type { LoggingLevel } from "./types";

export class Logger {
  readonly level: number;

  constructor(loggingLevel: LoggingLevel = "off") {
    this.level = 0;

    if (loggingLevel === "on") {
      this.level = 1;
    } else if (loggingLevel === "verbose") {
      this.level = 2;
    }
  }

  debug(...message: any[]) {
    if (this.level >= 2) {
      console.log("Modzy > ", ...message);
    }
  }

  info(...message: any[]) {
    if (this.level >= 1) {
      console.info("Modzy > ", ...message);
    }
  }

  error(...message: any[]) {
    if (this.level >= 1) {
      console.error("Modzy > ", ...message);
    }
  }
}
