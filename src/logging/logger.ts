import { LogLevel } from './log-level';

/** Logs information. */
export abstract class Logger {
  /** Gets a now representation for logging. */
  protected get now() {
    const now = new Date(Date.now());
    return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  }

  /**
   * Initializes the Logger.
   * @param categoryName The category's name.
   * @param loggingLevel The logging's level.
   */
  constructor(protected categoryName: string, protected loggingLevel: LogLevel) {}

  /**
   * Logs fatal text.
   * @param text The text to log.
   */
  fatal(text: string) {
    this._log(LogLevel.fatal, text);
  }

  /**
   * Logs error text.
   * @param text The text to log.
   */
  error(text: string) {
    this._log(LogLevel.error, text);
  }

  /**
   * Logs warn text.
   * @param text The text to log.
   */
  warn(text: string) {
    this._log(LogLevel.warn, text);
  }

  /**
   * Logs info text.
   * @param text The text to log.
   */
  info(text: string) {
    this._log(LogLevel.info, text);
  }

  /**
   * Logs verbose text.
   * @param text The text to log.
   */
  verbose(text: string) {
    this._log(LogLevel.verbose, text);
  }

  /**
   * Logs debug text.
   * @param text The text to log.
   */
  debug(text: string) {
    this._log(LogLevel.debug, text);
  }

  /**
   * Logs text.
   * @param level The level of the text to log.
   * @param text The text to log.
   */
  abstract log(level: LogLevel, text: string): void;

  private _log(level: LogLevel, text: string) {
    if (level <= this.loggingLevel) {
      this.log(level, text);
    }
  }
}
