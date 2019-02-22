import { Express } from 'express';
import { ActionFilter } from '../actioning';
import { Container } from 'inversify';
import { LoggerFactory } from '../logging';
import { Constructor } from '../helpers';

/** Defines the application's context. */
export interface ApplicationContext {
  /** The express application. */
  express: Express;

  /** The IoC container. */
  container: Container;

  /** The application's settings. */
  appSettings?: any;

  /** The global application filters. */
  filters?: Constructor<ActionFilter>[];
  /** The application's controllers. */

  controllers: Constructor[];

  /** The application's logger factory. */
  loggerFactory: LoggerFactory;
}
