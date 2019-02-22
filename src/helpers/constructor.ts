/**
 * Represents a constructor.
 * @template T The type of the constructor.
 */
export interface Constructor<T = any> {
  new (...args): T;
}

/**
 * Represents a constructor.
 * @template TArg The argument's type.
 * @template T The type of the constructor.
 */
export interface ConstructorArg1<TArg, T = any> {
  new (arg: TArg): T;
}
