import { HttpGet } from './http-get';
import { VIEW_SYMBOL } from './symbols';

export function View(route?: string, viewName?: string) {
  return (target, name: string) => {
    if (!viewName) {
      viewName = name;
    }

    Reflect.defineMetadata(VIEW_SYMBOL, viewName, target.constructor, name);

    HttpGet(route)(target, name);
  };
}
