import EngineInstance from '@ember/engine/instance';
import { getContext } from '@ember/test-helpers/setup-context';
import engineResolverFor from 'ember-engines/test-support/engine-resolver-for';
import { setupRenderingTest, setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import breakpoints from 'ember-osf-web/breakpoints';
import enConfig from 'ember-osf-web/locales/en/config';
import enTranslations from 'ember-osf-web/locales/en/translations';
import { setupOSFApplicationTest } from 'ember-osf-web/tests/helpers';

function setupEngineFixtures(hooks: any) {
    hooks.beforeEach(function(this: TestContext) {
        // Register constants that injected services use to simulate the same
        // behavior as the actual app/engine
        this.owner.register('breakpoints:main', breakpoints, { instantiate: false });
        this.owner.register('locale:en/config', enConfig);
        this.owner.register('locale:en/translations', enTranslations, { instantiate: false });
    });
}

export function setupEngineTest(hooks: any, engine: string) {
    // eslint-disable-next-line ember/no-restricted-resolver-tests
    setupTest(hooks, { resolver: engineResolverFor(engine) });
    setupEngineFixtures(hooks);
}

export function setupEngineRenderingTest(hooks: any, engine: string) {
    setupRenderingTest(hooks, { resolver: engineResolverFor(engine) });
    setupEngineFixtures(hooks);
}

export async function loadEngine(engine: string, mountPoint: string): Promise<EngineInstance> {
    const { owner } = (getContext() as any);
    // Engine construction happens in/on the router of the application
    // Engines use the application registry as a fallback, which means
    // any mocked services, etc that are injected won't get picked up.
    const router = owner.lookup('router:main');

    // Idempotent router setup, would otherwise be triggered by calling `visit()`
    router.setupRouter();

    if (!(mountPoint in router._engineInfoByRoute)) {
        throw new Error(`No engine is mounted at ${mountPoint}`);
    }

    // Create the engine instance using the engineInfo loaded by calling `setupRouter`
    const instance: EngineInstance = await router._loadEngineInstance(
        router._engineInfoByRoute[mountPoint],
    );

    // Boot the engine up, to mitigte potential race conditions
    await instance.boot();

    // Add the engine to the application registry for later use
    owner.register(`-engine-instance:${engine}-${mountPoint}`, instance, { instantiate: false });

    return instance;
}

export function setupEngineApplicationTest(hooks: any, engine: string, mountPoint?: string) {
    setupOSFApplicationTest(hooks);
    setupEngineFixtures(hooks);

    hooks.beforeEach(async () => {
        await loadEngine(engine, mountPoint || engine);
    });
}
