import { Action } from './action';

/**
 * Defines a post action on the controller.
 * @param route The HTTP route.
 */
export function HttpPost(route?: string) {
  return Action('post', route);
}
