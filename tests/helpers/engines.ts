import engineResolverFor from 'ember-engines/test-support/engine-resolver-for';
import { setupApplicationTest, setupRenderingTest, setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';

export function setupEngineTest(hooks: any, engine: string) {
    setupTest(hooks, { resolver: engineResolverFor(engine) });
}

export function setupEngineRenderingTest(hooks: any, engine: string) {
    setupRenderingTest(hooks, { resolver: engineResolverFor(engine) });
}

export function setupEngineApplicationTest(hooks: any, engine: string) {
    setupApplicationTest(hooks, { resolver: engineResolverFor(engine) });
}
