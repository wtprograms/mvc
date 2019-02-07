import { ColorMap } from './color-map';
import { LogLevel } from '../log-level';

/** Provides a default color map. */
export const DEFAULT_COLOR_MAPS: ColorMap[] = [
  {
    level: LogLevel.fatal,
    foreground: 'white',
    background: 'red'
  },
  {
    level: LogLevel.error,
    foreground: 'red'
  },
  {
    level: LogLevel.warn,
    foreground: 'yellow'
  },
  {
    level: LogLevel.info,
    foreground: 'white'
  },
  {
    level: LogLevel.verbose,
    foreground: 'gray'
  },
  {
    level: LogLevel.debug,
    foreground: 'blue'
  }
];
