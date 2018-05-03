import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import Service from '@ember/service';

import { initialize } from 'ember-osf-web/instance-initializers/prerender';
import { setupTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

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
    setupTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.TestApplication = Application.extend();
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });

        this.application = this.TestApplication.create({ autoboot: false });
        this.application.register('service:ready', ReadyStub);

        this.instance = ApplicationInstance.create({
            application: this.application,
            base: this.application,
        });
    });

    hooks.afterEach(function(this: Context) {
        destroyApp(this.application);
        destroyApp(this.instance);
    });

    test('it sets prerenderReady', async function(this: Context, assert) {
        assert.notOk(window.prerenderReady, 'prerenderReady starts false');

        await (this.instance as any).boot(); // private method

        assert.ok(window.prerenderReady, 'prerenderReady set true');
    });
});
