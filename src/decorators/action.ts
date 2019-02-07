import { ActionMetadata } from './metadata';
import { ACTION_SYMBOL } from './symbols';

/**
 * Defines an action on the controller.
 * @param httpMethod The HTTP method.
 * @param route The HTTP route.
 */
export function Action(httpMethod: string, route?: string) {
  return (target, name: string) => {
    const actions: ActionMetadata[] = Reflect.getOwnMetadata(ACTION_SYMBOL, target.constructor) || [];

    if (!route) {
      route = '/';
    }

    if (route[0] !== '/') {
      route = '/' + route;
    }

    actions.push({
      name,
      httpMethod,
      route
    });

    Reflect.defineMetadata(ACTION_SYMBOL, actions, target.constructor);
  };
}
