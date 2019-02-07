import { HttpContext, ModelState } from './actioning';

/** A controller interface that provides the http context and model state. */
export interface IController {
  /** The http context is the context surrounding the http call with its request and response. */
  httpContext: HttpContext;
  /** The current model state of the controller within its action. */
  modelState: ModelState;
}
