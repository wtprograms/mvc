import { LogLevel } from '../log-level';

/** Maps levels with colors. */
export interface ColorMap {
  /** The log's level. */
  level: LogLevel;

  /** The foreground color. */
  foreground?: string;

  /** The background color. */
  background?: string;
}
