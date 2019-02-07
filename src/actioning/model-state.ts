import { Request } from 'express';
import { validationResult, Result } from 'express-validator/check';

/** The action's model state in the controller. */
export class ModelState {
  /** Gets the validation's result.  */
  readonly validationResult: Result;
  /** The errors from the validation result. */
  readonly errors: any[];

  /** True if the validation has succeeded. */
  get isValid() {
    return this.validationResult.isEmpty();
  }

  /**
   * Initializes the Model State.
   * @param request The express' request.
   */
  constructor(request: Request) {
    this.validationResult = validationResult(request);
    if (!this.isValid) {
      this.errors = this.validationResult.array();
    }
  }
}
