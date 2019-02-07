import { Router } from 'express';
import { ApplicationContext } from '../hosting';
import { IController } from '../i-controller';
import { ActionMetadata, ModelMetadata, MODEL_SYMBOL, CONTROLLER_ROUTE_SYMBOL, FilterMetadata, FILTER_SYMBOL } from '../decorators';
import express = require('express');
import { HttpContext, ModelState, ActionContext } from '../actioning';
import { ViewResponse } from './view-response';
import { Logger } from '../logging';

/** Routes actions. */
export class ActionRouter {
  private logger: Logger;

  private get modelMetadata(): ModelMetadata {
    return Reflect.getOwnMetadata(MODEL_SYMBOL, this.controllerConstructor, this.actionMetadata.name);
  }

  private get controllerRoute(): string {
    return Reflect.getMetadata(CONTROLLER_ROUTE_SYMBOL, this.controllerConstructor);
  }

  private get controllerAndGlobalFilterMetadataCollection() {
    let filterMetadataCollection: FilterMetadata[] = [];
    for (const filterConstructor of this.applicationContext.filters) {
      filterMetadataCollection.push({ filterConstructor });
    }
    filterMetadataCollection = filterMetadataCollection.concat(Reflect.getMetadata(FILTER_SYMBOL, this.controllerConstructor) || []);
    return filterMetadataCollection;
  }

  /**
   * Initializes the ActionRouter.
   * @param controllerConstructor The controller's constructor.
   * @param actionMetadata The action's metadata.
   * @param applicationContext The application's context.
   */
  constructor(
    private controllerConstructor: new () => IController,
    private actionMetadata: ActionMetadata,
    private applicationContext: ApplicationContext
  ) {
    this.logger = applicationContext.loggerFactory.createLoggerOfType(ActionRouter);
  }

  /**
   * Routes the action.
   * @param router The router to route to.
   */
  route(router: Router): void {
    const modelMetadata = this.modelMetadata;
    const callFuncs = {
      get: router.get,
      post: router.post,
      put: router.put,
      delete: router.delete
    };
    const expressCallFunc = callFuncs[this.actionMetadata.httpMethod];
    const controllerRoute = this.controllerRoute;
    let routePath = controllerRoute + this.actionMetadata.route;
    if (routePath.endsWith('/')) {
      routePath = routePath.substring(0, routePath.length - 1);
    }
    this.logger.info(
      `Routing action "${this.actionMetadata.name}" with controller "${
        this.controllerConstructor.name
      }" on route "${this.actionMetadata.httpMethod.toUpperCase()}: ${routePath}"...`
    );
    if (modelMetadata && modelMetadata.validation) {
      expressCallFunc.call(router, routePath, modelMetadata.validation, async (req, res, next) => await this.handleRequest(req, res, next));
    } else {
      expressCallFunc.call(router, routePath, async (req, res, next) => await this.handleRequest(req, res, next));
    }
  }

  private async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      this.logger.info(`Route match with { action = "${this.actionMetadata.name}", controller = "${this.controllerConstructor.name}" }`);
      const controller = this.applicationContext.container.resolve(this.controllerConstructor);
      controller.httpContext = new HttpContext(req, res, this.applicationContext.container);
      controller.modelState = new ModelState(req);
      this.logger.info(`Validation state: ${controller.modelState.isValid ? 'Valid' : 'Invalid'}`);
      const action = controller[this.actionMetadata.name];
      const filters = this.controllerAndGlobalFilterMetadataCollection
        .filter(x => x.actionName === this.actionMetadata.name || !x.actionName)
        .map(x => new x.filterConstructor());
      const actionContext = new ActionContext(controller.httpContext, this.actionMetadata, controller);
      try {
        this.logger.info('Executing pre-filters...');
        for (const filter of filters) {
          const filterResponse = await Promise.resolve(filter.onActionExecuting(actionContext));
          if (filterResponse) {
            this.logger.verbose('A pre-filter has made a response.');
            this.logResponse(filterResponse);
            return filterResponse;
          }
        }
        this.logger.info('Executing action...');
        const parameters = this.getParameters(req);
        const actionResult = await Promise.resolve(action.apply(controller, parameters));
        if (this.isResponse(actionResult)) {
          actionContext.response = actionResult;
        } else if (this.isViewResponse(actionResult)) {
          actionContext.response = res;
          res.render(actionResult.viewName, actionResult.model);
        } else {
          this.logger.debug(`Result body: ${JSON.stringify(actionResult)}`);
          actionContext.response = res.json(actionResult);
        }
        this.logger.info('Executing post-filters...');
        for (const filter of filters) {
          const filterResponse = await Promise.resolve(filter.onActionExecuted(actionContext));
          if (filterResponse) {
            this.logger.verbose('A post-filter has made a response.');
            this.logResponse(filterResponse);
            return filterResponse;
          }
        }
        this.logResponse(actionContext.response);
        return actionContext.response;
      } catch (error) {
        this.logger.warn(`An unexpected error has occurred: ${error}`);
        this.logger.info('Executing error-filters...');
        for (const filter of filters) {
          const filterResponse = await Promise.resolve(filter.onError(actionContext, error));
          if (filterResponse) {
            this.logger.verbose('An error-filter has made a response.');
            this.logResponse(filterResponse);
            return filterResponse;
          }
        }
        this.logger.error('Error was unhandled.');
        next(error);
      }
    } catch (fatalError) {
      this.logger.fatal(`A fatal error has occurred: ${fatalError}`);
      throw fatalError;
    }
  }

  private logResponse(res: express.Response) {
    this.logger.info(`Returning response with code "${res.statusCode}".`);
  }

  private getParameters(req: express.Request) {
    const parameters = [];
    // tslint:disable-next-line:forin
    for (const name in req.params) {
      let value = req.params[name];
      if (!isNaN(value)) {
        value = Number.parseInt(value, 0);
      }
      parameters.push(value);
    }

    const modelMetadata: ModelMetadata = Reflect.getOwnMetadata(MODEL_SYMBOL, this.controllerConstructor, this.actionMetadata.name);

    if (modelMetadata) {
      this.logger.info('This action has a body.');
      this.logger.debug(`Body: ${JSON.stringify(req.body)}`);
      parameters.splice(modelMetadata.index, 0, req.body);
    }

    return parameters;
  }

  private isResponse(obj: any): obj is express.Response {
    return obj && obj.send && obj.json;
  }

  private isViewResponse(obj: any): obj is ViewResponse {
    return obj && obj.viewName;
  }
}
