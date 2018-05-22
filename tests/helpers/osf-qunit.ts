import injectCustomAssertions from 'ember-osf-web/tests/helpers/inject-custom-assertions';
import {
    setupApplicationTest as emberQunitSetupApplicationTest,
    setupRenderingTest as emberQunitSetupRenderingTest,
    setupTest as emberQunitSetupTest,
    SetupTestOptions,
} from 'ember-qunit';

export function setupTest(hooks: NestedHooks, options?: SetupTestOptions) {
    emberQunitSetupTest(hooks, options);
    injectCustomAssertions(hooks);
}

export function setupRenderingTest(hooks: NestedHooks, options?: SetupTestOptions) {
    emberQunitSetupRenderingTest(hooks, options);
    injectCustomAssertions(hooks);
}

export function setupApplicationTest(hooks: NestedHooks, options?: SetupTestOptions) {
    emberQunitSetupApplicationTest(hooks, options);
    injectCustomAssertions(hooks);
}
