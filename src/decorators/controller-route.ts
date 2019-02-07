import { CONTROLLER_ROUTE_SYMBOL } from './symbols';

/**
 * Defines a route for the controller.
 * @param route The controller's HTTP route.
 */
export function ControllerRoute(route?: string) {
  return target => {
    if (!route) {
      route = '/';
    }

    Reflect.defineMetadata(CONTROLLER_ROUTE_SYMBOL, route, target);
  };
}
