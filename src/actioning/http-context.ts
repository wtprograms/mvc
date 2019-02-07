import { Request, Response } from 'express';
import { Container } from 'inversify';

/** Used to give context to the http's call. */
export class HttpContext {
  /**
   * Initializes the HttpContext.
   * @param request The request object.
   * @param response The response object.
   * @param container The IoC container.
   */
  constructor(public request: Request, public response: Response, public container: Container) {}
}
