import { assert } from '@ember/debug';

/**
 * Property decorator for required action arguments in components.
 * Provides a default action method that raises a useful error.
 *
 * Usage:
 *
 * ```ts
 *  import requiredAction from 'ember-osf-web/utils/required-action';
 *
 *  class MyComponent extends Component {
 *      // Required arguments
 *      @requiredAction doTheThing: (arg: number) => void;
 *  }
 * ```
 */
export default function requiredAction(
    classPrototype: any,
    propertyName: string,
): any {
    const className = classPrototype.constructor.name;

    // eslint-disable-next-line no-param-reassign
    classPrototype[propertyName] = () => {
        assert(`Missing required action in ${className}: ${propertyName}`);
    };
}
