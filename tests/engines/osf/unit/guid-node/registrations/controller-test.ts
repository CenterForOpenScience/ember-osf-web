import Service from '@ember/service';
import { setupEngineTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Unit | Controller | guid-node/registrations', hooks => {
    setupEngineTest(hooks, 'osf');

    const analyticsStub = Service.extend();
    const i18nStub = Service.extend();
    const statusMessagesStub = Service.extend();
    const toastStub = Service.extend();

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:analytics', analyticsStub);
        this.owner.register('service:i18n', i18nStub);
        this.owner.register('service:statusMessages', statusMessagesStub);
        this.owner.register('service:toast', toastStub);
    });

    // Replace this with your real tests.
    test('it exists', function(assert) {
        const controller = this.owner.lookup('controller:guid-node/registrations');
        assert.ok(controller);
    });
});
