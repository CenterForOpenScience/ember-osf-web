import Component from '@ember/component';
import { assert } from '@ember/debug';

/**
 * Property decorator for required action arguments in components.
 * Provides a default action method that raises a useful error.
 *
 * Usage:
 *
 * ```ts
 *  import { requiredAction } from 'ember-osf-web/utils/required-action';
 *
 *  class MyComponent extends Component {
 *      // Required arguments
 *      @requiredAction doTheThing: (arg: number) => void;
 *  }
 * ```
 */
export function requiredAction(
    classPrototype: any,
    propertyName: string,
): any {
    const className = classPrototype.constructor.name;

    // eslint-disable-next-line no-param-reassign
    classPrototype[propertyName] = () => {
        assert(`Missing required action in ${className}: ${propertyName}`);
    };
}

/**
 * Property decorator for optional action arguments in components.
 * Provides a default action method that does nothing.
 *
 * Usage:
 *
 * ```ts
 *  import { optionalAction } from 'ember-osf-web/utils/required-action';
 *
 *  class MyComponent extends Component {
 *      // Optional arguments
 *      @optionalAction doTheThing: (arg: number) => void;
 *  }
 * ```
 */
export function optionalAction(
    classPrototype: any,
    propertyName: string,
): any {
    // eslint-disable-next-line no-param-reassign
    classPrototype[propertyName] = () => { /* empty */ };
}

/**
 * Class decorator to set layout and styles in components.
 *
 * Same as ember-decorator's `@layout`, but with an additional optional `styles` param
 */
export function layout(template: unknown, styles?: unknown) {
    return <T extends Newable<Component>>(ComponentSubclass: T) => {
        /* eslint-disable no-param-reassign */
        ComponentSubclass.prototype.layout = template;
        ComponentSubclass.prototype.styles = styles;
        /* eslint-enable no-param-reassign */
        return ComponentSubclass;
    };
}
