import { ValidationChain } from 'express-validator/check';

/** Defines metadata for a model. */
export interface ModelMetadata {
  /** The model's index on the parameters. */
  index: number;

  /** The model's validation. */
  validation: ValidationChain[];
}
