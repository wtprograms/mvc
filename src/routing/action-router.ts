import { Router } from 'express';
import { ApplicationContext } from '../hosting';
import {
  ActionMetadata,
  ModelMetadata,
  MODEL_SYMBOL,
  CONTROLLER_ROUTE_SYMBOL,
  FilterMetadata,
  FILTER_SYMBOL,
  VIEW_SYMBOL
} from '../decorators';
import express = require('express');
import { HttpContext, ModelState, ActionContext, ActionFilter } from '../actioning';
import { Logger } from '../logging';
import { Constructor } from '../helpers';
import { Controller } from '../controller';

/** Routes actions. */
export class ActionRouter {
  private logger: Logger;

  private get modelMetadata(): ModelMetadata {
    return Reflect.getOwnMetadata(MODEL_SYMBOL, this.controllerConstructor, this.actionMetadata.name);
  }

  private get controllerRoute(): string {
    return Reflect.getMetadata(CONTROLLER_ROUTE_SYMBOL, this.controllerConstructor);
  }

  private get viewMetadata(): string {
    const viewMetadata = Reflect.getOwnMetadata(VIEW_SYMBOL, this.controllerConstructor, this.actionMetadata.name);
    return viewMetadata;
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
    private controllerConstructor: Constructor<Controller>,
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
    this.logger.verbose(
      `Routing action "${this.actionMetadata.name}" with controller "${
        this.controllerConstructor.name
      }" on route "${this.actionMetadata.httpMethod.toUpperCase()}: ${routePath}"...`
    );
    const parameters: any[] = [routePath];
    if (modelMetadata && modelMetadata.validation) {
      parameters.push(modelMetadata.validation);
    }
    parameters.push(async (req, res, next) => await this.handleRequest(req, res, next));
    expressCallFunc.apply(router, parameters);
  }

  private async executeFilters(method: string, filters: ActionFilter<any>[], actionContext: ActionContext, error?: Error) {
    for (const filter of filters) {
      const executor = filter[method];
      const filterResponse = await Promise.resolve(executor.call(filter, actionContext, error));
      if (filterResponse) {
        this.logger.verbose('A filter has made a response.');
        this.logResponse(filterResponse);
        return filterResponse;
      }
    }
    return undefined;
  }

  private async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      this.logger.info(`Route match with { action = "${this.actionMetadata.name}", controller = "${this.controllerConstructor.name}" }`);
      const controller: Controller = this.applicationContext.container.resolve(this.controllerConstructor);
      controller.httpContext = new HttpContext(req, res, new ModelState(req));
      this.logger.info(`Validation state: ${controller.httpContext.modelState.isValid ? 'Valid' : 'Invalid'}`);
      const action = controller[this.actionMetadata.name];
      const filters = this.controllerAndGlobalFilterMetadataCollection
        .filter(x => x.actionName === this.actionMetadata.name || !x.actionName)
        .map(x => this.applicationContext.container.resolve(x.filterConstructor));
      const actionContext = new ActionContext(controller.httpContext, this.actionMetadata, controller);
      const viewMetadata = this.viewMetadata;
      if (viewMetadata) {
        this.logger.debug(`View: ${viewMetadata}`);
      }
      try {
        this.logger.info('Executing pre-filters...');
        let filterResponse = await this.executeFilters('onActionExecuting', filters, actionContext);
        if (filterResponse) {
          return filterResponse;
        }
        this.logger.info('Executing action...');
        const parameters = this.getParameters(req);
        const actionResult = await Promise.resolve(action.apply(controller, parameters));
        if (this.isResponse(actionResult)) {
          actionContext.response = actionResult;
        } else {
          this.logger.debug(`Result body: ${JSON.stringify(actionResult)}`);
          actionContext.response = res.json(actionResult);
        }
        this.logger.info('Executing post-filters...');
        filterResponse = await this.executeFilters('onActionExecuted', filters, actionContext);
        if (filterResponse) {
          return filterResponse;
        }
        this.logResponse(actionContext.response);
        if (viewMetadata) {
          this.logger.info(`Rendering view ${viewMetadata}...`);
          res.render(viewMetadata, actionResult);
        } else {
          return actionContext.response;
        }
      } catch (error) {
        this.logger.warn(`An unexpected error has occurred: ${error}`);
        this.logger.info('Executing error-filters...');
        const filterResponse = await this.executeFilters('onError', filters, actionContext, error);
        if (filterResponse) {
          return filterResponse;
        }
        this.logger.error(`Error was unhandled: ${error.stack}`);
        next(error);
      }
    } catch (fatalError) {
      this.logger.fatal(`A fatal error has occurred: ${fatalError.stack}`);
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
}
