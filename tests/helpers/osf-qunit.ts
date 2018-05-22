import injectCustomAssertions from 'ember-osf-web/tests/helpers/inject-custom-assertions';
import {
    setupApplicationTest as emberQunitSetupApplicationTest,
    setupRenderingTest as emberQunitSetupRenderingTest,
    setupTest as emberQunitSetupTest,
} from 'ember-qunit';

export function setupTest(hooks: NestedHooks) {
    emberQunitSetupTest(hooks);
    injectCustomAssertions(hooks);
}

export function setupRenderingTest(hooks: NestedHooks) {
    emberQunitSetupRenderingTest(hooks);
    injectCustomAssertions(hooks);
}

export function setupApplicationTest(hooks: NestedHooks) {
    emberQunitSetupApplicationTest(hooks);
    injectCustomAssertions(hooks);
}
