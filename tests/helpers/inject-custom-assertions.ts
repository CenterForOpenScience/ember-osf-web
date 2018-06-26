import { assertionCleanup, assertionInjector } from 'ember-osf-web/tests/assertions';
import { TestContext } from 'ember-test-helpers';

export default function(hooks: NestedHooks) {
    hooks.beforeEach(function(this: TestContext) {
        assertionInjector(this);
    });

    hooks.afterEach(function(this: TestContext) {
        assertionCleanup(this);
    });
}
