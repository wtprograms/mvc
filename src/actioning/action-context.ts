import { Response } from 'express';
import { ActionMetadata } from '../decorators';
import { HttpContext } from './http-context';

/**
 * The action context defines the context when the action is executed.
 * @template TController The action's controller type.
 */
export class ActionContext<TController = any> {
  /** The current response of the action. */
  response?: Response;

  /**
   * Initializes the action context.
   * @param httpContext The http call's context.
   * @param actionMetadata The action's metadata.
   * @param controller The action's controller.
   */
  constructor(public httpContext: HttpContext, public actionMetadata: ActionMetadata, public controller: TController) {}
}
