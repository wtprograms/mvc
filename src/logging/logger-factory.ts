import { Logger } from './logger';
import { LoggerProvider } from './logger-provider';
import { CombinedLogger } from './combined-logger';
import { LogLevel } from './log-level';
import { Constructor } from '../helpers';

/** A factory for creating loggers. */
export class LoggerFactory {
  /** A collection of logger providers. */
  providers: LoggerProvider[] = [];

  /** The level of the logging. */
  loggingLevel: LogLevel = LogLevel.info;

  /**
   * Creates a logger.
   * @param categoryName The category's name.
   */
  createLogger(categoryName: string): Logger {
    return new CombinedLogger(categoryName, this.loggingLevel, this.providers);
  }

  /**
   * Creates a logger by using the constructor name as the category.
   * @param constructor A constructor as the category name.
   * @template T The constructor's type.
   */
  createLoggerOfType<T>(constructor: Constructor<T>) {
    return this.createLogger(constructor.name);
  }

  /**
   * Creates a logger by using the constructor name as the category.
   * @param obj The instance with the constructor as the category name.
   */
  createLoggerOfThis(obj: any) {
    return this.createLoggerOfType(obj.constructor);
  }
}
