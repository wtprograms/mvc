/** Gives metadata to an action. */
export interface ActionMetadata {
  /** The action's name. */
  name: string;

  /** The action's route. */
  route?: string;

  /** The action's HTTP method. */
  httpMethod?: string;
}
