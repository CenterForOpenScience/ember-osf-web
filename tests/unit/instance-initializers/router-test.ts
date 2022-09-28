import Application from '@ember/application';
import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';
import Resolver from 'ember-resolver';
import { TestContext } from 'ember-test-helpers';
import config from 'ember-get-config';
import { module, test } from 'qunit';
import sinon from 'sinon';

import { initialize } from 'ember-osf-web/instance-initializers/router';

interface InitializerTestContext extends TestContext {
    TestApplication: any;
    application: Application;
    instance: ApplicationInstance;
}

const { modulePrefix } = config;

module('Unit | Instance Initializer | router', function(this: InitializerTestContext, hooks) {
    hooks.beforeEach(function(this: InitializerTestContext) {
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
    });

    hooks.afterEach(function(this: InitializerTestContext) {
        run(this.instance, 'destroy');
        run(this.application, 'destroy');
    });

    test('it sets handlers to router service', async function(this: InitializerTestContext, assert) {
        const routerService = this.instance.lookup('service:router');
        const routerOn = sinon.stub(routerService, 'on');
        assert.ok(routerOn.notCalled, 'Event handlers are not yet set on router service');
        await this.instance.boot();
        assert.ok(routerOn.calledTwice, 'handlers set');
        assert.ok(routerOn.calledWith('routeWillChange', sinon.match.func), 'routeWillChange handler set');
        assert.ok(routerOn.calledWith('routeDidChange', sinon.match.func), 'routeDidChange handler set');
    });
});
