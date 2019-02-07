import { Action } from './action';

/**
 * Defines a put action on the controller.
 * @param route The HTTP route.
 */
export function HttpPut(route?: string) {
  return Action('put', route);
}
