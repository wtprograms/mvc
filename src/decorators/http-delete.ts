import { Action } from './action';

/**
 * Defines a delete action on the controller.
 * @param route The HTTP route.
 */
export function HttpDelete(route?: string) {
  return Action('delete', route);
}
