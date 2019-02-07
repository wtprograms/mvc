import { ActionFilter } from '../../actioning';

/** A filter's metadata. */
export interface FilterMetadata {
  /** Gets or sets the filter's constructor. */
  filterConstructor: new (...args) => ActionFilter;
  /** Gets or sets the filter's action name. */
  actionName?: string;
}
