import { IController } from './i-controller';
import { HttpContext, ModelState } from '.';
import { ViewResponse } from './routing';

/** The base controller gives functionality to a controller. */
export class Controller implements IController {
  /** @inheritdoc */
  httpContext: HttpContext;
  /** @inheritdoc */
  modelState: ModelState;

  /**
   * Returns a bad request response.
   * @param obj The object to send with the bad request.
   */
  badRequest(obj?: any) {
    return this.httpContext.response.status(400).json(obj);
  }

  /**
   * Returns a bad request with a failed validation object.
   * @param param The parameter.
   * @param msg The fail message.
   * @param location The location of the failure.
   */
  failValidation(param: string, msg: string, location: string = 'body') {
    return this.badRequest([
      {
        location,
        msg,
        param
      }
    ]);
  }

  /**
   * Returns a ViewResponse that will be used to render the view in express.
   * @param viewName The view's name.
   * @param model The view's model.
   */
  view(viewName: string, model?): ViewResponse {
    return {
      model,
      viewName
    };
  }
}
