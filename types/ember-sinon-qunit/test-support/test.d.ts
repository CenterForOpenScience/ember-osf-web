declare module 'ember-sinon-qunit/test-support/test' {
    import { TestContext } from 'ember-test-helpers';

    interface SinonTestContext extends TestContext {
        stub(...args: any[]): any;
    }

    function test(name: string, callback: (this: SinonTestContext, assert: Assert) => void): void;

    export default test;
}
