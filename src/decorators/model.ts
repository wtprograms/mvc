import { MODEL_SYMBOL } from './symbols';
import { ValidationChain } from 'express-validator/check';
import { ModelMetadata } from './metadata';

/**
 * Defines a model parameter in the action.
 * @param validation The model's validation.
 */
export function Model(validation?: ValidationChain[]) {
  return (target, name: string, index: number) => {
    const metadata: ModelMetadata = {
      index,
      validation
    };
    Reflect.defineMetadata(MODEL_SYMBOL, metadata, target.constructor, name);
  };
}
