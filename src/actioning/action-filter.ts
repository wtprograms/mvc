import { Response } from 'express';
import { ActionContext } from './action-context';

/**
 * An action filter is executed at different stages of the action.
 * @template TController The action's controller type.
 */
export interface ActionFilter<TController = any> {
  /**
   * Executed before the action.
   * @param actionContext The action's context.
   * @returns The response that a filter returns is the response that will go to the client.
   */
  onActionExecuted(actionContext: ActionContext<TController>): Promise<Response | undefined> | Response | undefined;

  /**
   * Executed after the action.
   * @param actionContext The action's context.
   * @returns The response that a filter returns is the response that will go to the client.
   */
  onActionExecuting(actionContext: ActionContext<TController>): Promise<Response | undefined> | Response | undefined;

  /**
   * Executed when an error occurred during the action.
   * @param actionContext The action's context.
   * @param error The action's error.
   * @returns The response that a filter returns is the response that will go to the client.
   */
  onError(actionContext: ActionContext<TController>, error: Error): Promise<Response | undefined> | Response | undefined;
}
