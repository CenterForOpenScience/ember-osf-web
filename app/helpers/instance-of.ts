import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

import Helper from '@ember/component/helper';

export default class InstanceOf extends Helper {
    compute([object, className]: [any, string]) {
        if (!object || typeof className !== 'string') {
            return false;
        }
        // Look up the class from the container
        const owner = getOwner(this);
        const klass = owner.factoryFor(`model:${className}`)?.class;
        if (!klass) {
            assert(`Class "${className}" not found`);
            return false;
        }
        return object instanceof klass;
    }
}
