import { ApplicationContext } from './application-context';

/** Used by the web host for start up configuration. */
export abstract class Startup {
  /**
   * Initializes the startup.
   * @param context The application's context.
   */
  constructor(protected context: ApplicationContext) {}

  abstract configure(): Promise<void> | void;
}
