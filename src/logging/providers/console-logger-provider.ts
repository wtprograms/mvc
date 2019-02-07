import { LoggerProvider } from '../logger-provider';
import { Logger } from '../logger';
import { ConsoleLogger } from './console-logger';
import { LogLevel } from '../log-level';
import { ColorMap } from './color-map';

/**
 * Provides a console logger.
 */
export class ConsoleLoggerProvider extends LoggerProvider {
  /**
   * Initializes the console logger.
   * @param colorMaps The color maps.
   */
  constructor(private colorMaps: ColorMap[] = []) {
    super();
  }

  /** @inheritdoc */
  createLogger(categoryName: any, loggingLevel: LogLevel): Logger {
    return new ConsoleLogger(categoryName, loggingLevel, this.colorMaps);
  }
}
