import { Logger } from './logger';
import { LoggerProvider } from './logger-provider';
import { LogLevel } from './log-level';

/** Logs to a combination of loggers. */
export class CombinedLogger extends Logger {
  private loggers: Logger[];

  /**
   * Initializes the combined logger.
   * @param categoryName The category's name.
   * @param loggingLevel The logging level.
   * @param providers The providers of the loggers.
   */
  constructor(categoryName: string, loggingLevel: LogLevel, private providers: LoggerProvider[]) {
    super(categoryName, loggingLevel);
    this.loggers = this.providers.map(x => x.createLogger(this.categoryName, this.loggingLevel));
  }

  /** @inheritdoc */
  log(level: LogLevel, text: string): void {
    for (const logger of this.loggers) {
      logger.log(level, text);
    }
  }
}
