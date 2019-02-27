import { HttpContext } from './actioning';
import { Controller } from './controller';

export abstract class ControllerBase implements Controller {
  httpContext: HttpContext;
}
