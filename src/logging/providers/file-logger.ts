import { Logger } from '../logger';
import { LogLevel } from '../log-level';
import fs = require('fs');
import path = require('path');

/** Logs to a file. */
export class FileLogger extends Logger {
  private get fullPath() {
    return path.resolve(this.fileName);
  }

  private get directory() {
    return path.dirname(this.fullPath);
  }

  private get extension() {
    return path.extname(this.fileName).toLowerCase();
  }

  private get noExt() {
    return this.fileName.replace(this.extension, '');
  }

  /**
   * Initializes the file logger.
   * @param categoryName The category's name.
   * @param loggingLevel The logging level.
   * @param fileName The file name to log to.
   */
  constructor(categoryName: string, loggingLevel: LogLevel, private fileName: string) {
    super(categoryName, loggingLevel);
  }

  /** @inheritdoc */
  log(level: LogLevel, text: string) {
    const fileName = this.fullPath;
    const exists = fs.existsSync(fileName);
    if (exists) {
      const stats = fs.statSync(fileName);
      if (stats.size >= 1048576) {
        const logFileCount = fs.readdirSync(this.directory).filter(x => this.isLogFile(x)).length;
        fs.renameSync(fileName, path.resolve(`${this.noExt}-${logFileCount}${this.extension}`));
      }
    }
    text = `${LogLevel[level]}: [${this.categoryName}] {${this.now}} - ${text}\r\n`;
    fs.appendFile(fileName, text, () => {});
  }

  private isLogFile(fileName: string) {
    const extension = this.extension;
    fileName = path.resolve(fileName);
    const noExt = path.resolve(this.fullPath).replace(this.extension, '');
    return path.extname(fileName).toLowerCase() === extension && fileName.includes(noExt);
  }
}
