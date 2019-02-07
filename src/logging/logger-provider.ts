import { Logger } from './logger';
import { LogLevel } from './log-level';

/** Responsibile for providing a logger. */
export abstract class LoggerProvider {
  /**
   * Creates a logger.
   * @param categoryName The category's name.
   * @param loggingLevel The logging's level.
   */
  abstract createLogger(categoryName: string, loggingLevel: LogLevel): Logger;
}
