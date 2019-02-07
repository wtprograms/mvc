import { ApplicationContext } from './application-context';

/** Used by the web host for start up configuration. */
export interface IStartup {
  /**
   * Configures the application.
   * @param context The application's context.
   */
  configure(context: ApplicationContext): Promise<void> | void;
}
