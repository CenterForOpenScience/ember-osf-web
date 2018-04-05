import Application from '@ember/application';
import Service from '@ember/service';

import { initialize } from 'ember-osf-web/instance-initializers/prerender';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

class ReadyStub extends Service {
    ready() {
        return Promise.resolve();
    }
}

module('Unit | Instance Initializer | prerender', hooks => {
    setupTest(hooks);

    hooks.beforeEach(function() {
        this.TestApplication = Application.extend();
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });
        this.application = this.TestApplication.create({ autoboot: false });
        this.application.register('service:ready', ReadyStub);
        this.instance = this.application.buildInstance();
    });
    hooks.afterEach(function() {
        destroyApp(this.application);
        destroyApp(this.instance);
    });

    test('it sets prerenderReady', async function(assert) {
        assert.notOk(window.prerenderReady, 'prerenderReady starts false');

        await this.instance.boot();

        assert.ok(window.prerenderReady, 'prerenderReady set true');
    });
});
