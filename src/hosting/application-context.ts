import { Express } from 'express';
import { ActionFilter } from '../actioning';
import { Container } from 'inversify';
import { LoggerFactory } from '../logging';

/** Defines the application's context. */
export interface ApplicationContext {
  /** The express application. */
  express: Express;
  /** The IoC container. */
  container: Container;
  /** The application's settings. */
  appSettings?: any;
  /** The global application filters. */
  filters?: (new (...args) => ActionFilter)[];
  /** The application's controllers. */

  controllers: (new (...args) => any)[];
  /** The application's logger factory. */
  loggerFactory: LoggerFactory;
}
