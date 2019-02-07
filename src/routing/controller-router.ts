import { ApplicationContext } from '../hosting';
import { IController } from '../i-controller';
import { Router } from 'express';
import { ACTION_SYMBOL } from '../decorators';
import { ActionRouter } from './action-router';
import { injectable } from 'inversify';
import { Logger } from '../logging';

/** Routes a controller. */
export class ControllerRouter {
  private logger: Logger;

  /**
   * Initializes the router.
   * @param controllerConstructor The controller's constructor.
   * @param applicationContext The application's context.
   */
  constructor(private controllerConstructor: new () => IController, private applicationContext: ApplicationContext) {
    this.logger = applicationContext.loggerFactory.createLoggerOfType(ControllerRouter);
  }

  /** Creates a router for the controller and its actions. */
  route() {
    const router = Router();
    const actionMetadataCollection = Reflect.getOwnMetadata(ACTION_SYMBOL, this.controllerConstructor);
    this.logger.info(`Routing controller "${this.controllerConstructor.name}" with ${actionMetadataCollection.length} action(s)...`);
    injectable()(this.controllerConstructor);
    for (const actionMetadata of actionMetadataCollection) {
      const actionRouter = new ActionRouter(this.controllerConstructor, actionMetadata, this.applicationContext);
      actionRouter.route(router);
    }
    return router;
  }
}
