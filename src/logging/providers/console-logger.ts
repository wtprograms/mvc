import { Logger } from '../logger';
import { LogLevel } from '../log-level';
import { ColorMap } from './color-map';
import chalk from 'chalk';

/** Logs to the console. */
export class ConsoleLogger extends Logger {
  /**
   * Initializes the console logger.
   * @param categoryName The category's name.
   * @param loggingLevel The logging level.
   * @param colorMaps The color maps.
   */
  constructor(categoryName: string, loggingLevel: LogLevel, private colorMaps: ColorMap[] = []) {
    super(categoryName, loggingLevel);
  }

  /** @inheritdoc */
  log(level: LogLevel, text: string): void {
    const colorMap = this.colorMaps.find(x => x.level === level);
    let levelStr = LogLevel[level];
    if (colorMap) {
      if (colorMap.foreground) {
        levelStr = chalk.keyword(colorMap.foreground)(levelStr);
      }
      if (colorMap.background) {
        levelStr = chalk.bgKeyword(colorMap.background)(levelStr);
      }
    }
    console.log(`${levelStr}: [${this.categoryName}] {${this.now}} - ${text}`);
  }
}
