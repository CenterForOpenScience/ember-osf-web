declare module 'ember-engines/test-support' {
    import { render, TestContext } from 'ember-test-helpers';
    import { TestContext as IntlTestContext } from 'ember-intl/test-support';

    export interface EnginesTestContext extends TestContext {
        engine: any;
    }

    export interface EnginesIntlTestContext extends IntlTestContext {
        engine: any;
    }

    export function setupEngine(hooks: NestedHooks, engineName: string): void;
}
