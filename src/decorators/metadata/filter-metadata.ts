import { ActionFilter } from '../../actioning';
import { Constructor } from '../../helpers';

/** A filter's metadata. */
export interface FilterMetadata {
  /** Gets or sets the filter's constructor. */
  filterConstructor: Constructor<ActionFilter>;

  /** Gets or sets the filter's action name. */
  actionName?: string;
}
