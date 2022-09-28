import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';
import Service from '@ember/service';
import config from 'ember-get-config';
import Resolver from 'ember-resolver';

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

const { modulePrefix } = config;

module('Unit | Instance Initializer | prerender', hooks => {
    hooks.beforeEach(function(this: Context) {
        this.TestApplication = class TestApplication extends Application {
            modulePrefix = modulePrefix;
            Resolver = Resolver;
        };
        this.TestApplication.instanceInitializer({
            name: 'initializer under test',
            initialize,
        });

        this.application = this.TestApplication.create({ autoboot: false });

        this.instance = this.application.buildInstance();
        this.instance.register('service:ready', ReadyStub);

        window.prerenderReady = false;
    });

    hooks.afterEach(function(this: Context) {
        run(this.application, 'destroy');
        run(this.instance, 'destroy');
    });

    test('it sets prerenderReady', async function(this: Context, assert) {
        assert.notOk(window.prerenderReady, 'prerenderReady starts false');
        await this.instance.boot();
        assert.ok(window.prerenderReady, 'prerenderReady set true');
    });
});
