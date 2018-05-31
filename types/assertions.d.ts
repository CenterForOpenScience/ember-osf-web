declare module 'ember-osf-web/tests/assertions' {
    import { TestContext } from 'ember-tests-helpers';

    function assertionInjector<Context extends TestContext>(context: Context): void;
    function assertionCleanup<Context extends TestContext>(context: Context): void;
}
