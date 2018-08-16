declare module 'ember-sinon-qunit/test-support/test' {
    import { TestContext } from 'ember-test-helpers';
    import {
        SinonMockStatic,
        SinonSandbox,
        SinonSpyStatic,
        SinonStubStatic,
    } from 'sinon';

    interface SinonTestContext extends TestContext {
        spy: SinonSpyStatic;
        mock: SinonMockStatic;
        stub: SinonStubStatic;
        sandbox: SinonSandbox;
    }

    function test(name: string, callback: (this: SinonTestContext, assert: Assert) => void): void;

    export default test;
}
