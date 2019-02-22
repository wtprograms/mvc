import { FILTER_SYMBOL } from './symbols';
import { ActionFilter } from '../actioning';
import { FilterMetadata } from './metadata';
import { Constructor } from '../helpers';

/**
 * Defines a filter on the action.
 * @param filterConstructor The filter's constructor.
 */
export function Filter(filterConstructor: Constructor<ActionFilter>) {
  return (target, name: string) => {
    const actions: FilterMetadata[] = Reflect.getOwnMetadata(FILTER_SYMBOL, target.constructor) || [];

    actions.push({
      actionName: name,
      filterConstructor
    });

    Reflect.defineMetadata(FILTER_SYMBOL, actions, target.constructor);
  };
}
