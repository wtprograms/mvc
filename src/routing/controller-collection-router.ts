import { ApplicationContext } from '../hosting';
import { Router } from 'express';
import { ControllerRouter } from './controller-router';
import { Logger } from '../logging';

/** Routes a collection of controllers. */
export class ControllerCollectionRouter {
  private logger: Logger;

  /**
   * Routes the controller.
   * @param applicationContext The application's context.
   */
  constructor(private applicationContext: ApplicationContext) {
    this.logger = applicationContext.loggerFactory.createLoggerOfType(ControllerCollectionRouter);
  }

  /** Creates a router for the controllers. */
  route() {
    const router = Router();
    this.logger.info(`Routing ${this.applicationContext.controllers.length} controller(s)...`);
    for (const controllerConstructor of this.applicationContext.controllers) {
      const controllerRouter = new ControllerRouter(controllerConstructor, this.applicationContext);
      router.use(controllerRouter.route());
    }
    return router;
  }
}
