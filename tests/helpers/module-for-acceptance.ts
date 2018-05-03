import { TestContext } from 'ember-test-helpers';
import { module } from 'qunit';
import destroyApp from '../helpers/destroy-app';
import startApp from '../helpers/start-app';

interface Options {
    beforeEach?: () => any;
    afterEach?: () => any;
}

interface Context extends TestContext {
    application: any;
}

export default function(name: string, options: Options = {}) {
    module(name, {
        beforeEach(this: Context, assert) {
            this.application = startApp();

            if (options.beforeEach) {
                return options.beforeEach.call(this, assert);
            }
        },

        async afterEach(this: Context, assert) {
            if (options.afterEach) {
                await options.afterEach.call(this, assert);
            }

            return destroyApp(this.application);
        },
    });
}
