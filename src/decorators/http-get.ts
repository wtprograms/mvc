import { Action } from './action';

/**
 * Defines a get action on the controller.
 * @param route The HTTP route.
 */
export function HttpGet(route?: string) {
  return Action('get', route);
}
