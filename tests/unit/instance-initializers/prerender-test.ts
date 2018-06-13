import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';
import Service from '@ember/service';

import { initialize } from 'ember-osf-web/instance-initializers/prerender';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

class ReadyStub extends Service {
    ready() {
        return Promise.resolve();
    }
}

interface Context extends TestContext {
    TestApplication: any;
    application: Application;
    instance: ApplicationInstance;
}

module('Unit | Instance Initializer | prerender', hooks => {
    hooks.beforeEach(function(this: Context) {
        this.TestApplication = Application.extend();
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });

        this.application = this.TestApplication.create({ autoboot: false }) as any;
        this.application.register('service:ready', ReadyStub);

        this.instance = (this.application as any).buildInstance();
        window.prerenderReady = false;
    });

    hooks.afterEach(function(this: Context) {
        run(this.application, 'destroy');
        run(this.instance, 'destroy');
    });

    test('it sets prerenderReady', async function(this: Context, assert) {
        assert.notOk(window.prerenderReady, 'prerenderReady starts false');

        await (this.instance as any).boot(); // private method

        assert.ok(window.prerenderReady, 'prerenderReady set true');
    });
});
