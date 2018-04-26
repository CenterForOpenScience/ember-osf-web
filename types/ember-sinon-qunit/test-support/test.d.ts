declare module 'ember-sinon-qunit/test-support/test' {
    import { TestContext } from 'ember-test-helpers';

    interface SinonTestContext extends TestContext {
        stub(...args: any[]): any;
    }

    // eslint-disable-next-line no-restricted-globals
    function test(name: string, callback: (this: SinonTestContext, assert: Assert) => void): void;

    export default test;
}
