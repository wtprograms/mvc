import { LoggerProvider } from '../logger-provider';
import { FileLogger } from './file-logger';
import { LogLevel } from '../log-level';

/** Provides a file logger. */
export class FileLoggerProvider extends LoggerProvider {
  /**
   * Initializes the provider.
   * @param fileName The file name to log to.
   */
  constructor(private fileName: string) {
    super();
  }

  /** @inheritdoc */
  createLogger(categoryName: string, loggingLevel: LogLevel) {
    return new FileLogger(categoryName, loggingLevel, this.fileName);
  }
}
