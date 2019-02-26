import { HttpContext } from '.';

/** The controller provides the class with an http context. */
export interface Controller {
  httpContext: HttpContext;
}
