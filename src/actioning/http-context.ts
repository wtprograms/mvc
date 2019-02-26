import { Request, Response } from 'express';
import { ModelState } from './model-state';

/** Used to give context to the http's call. */
export class HttpContext {
  /**
   * Initializes the HttpContext.
   * @param request The request object.
   * @param response The response object.
   * @param modelState The model state.
   */
  constructor(public request: Request, public response: Response, public modelState?: ModelState) {}

  /**
   * Returns a bad request response.
   * @param obj The object to send with the bad request.
   */
  badRequest(obj?: any) {
    return this.response.status(400).json(obj);
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
}
