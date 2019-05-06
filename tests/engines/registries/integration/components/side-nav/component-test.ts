import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';

class RouterStub extends Service {
    urlFor() {
        return 'http://example.com';
    }

    isActive() {
        return false;
    }

    transitionTo() {
        // empty
    }
}

class CurrentUserStub extends Service {
}

/* tslint:disable:only-arrow-functions */
module('Registries | Integration | Component | side-nav', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', RouterStub);
        this.owner.register('service:current-user', CurrentUserStub);
    });

    test('it renders', async assert => {
        await render(hbs`<SideNav />`);

        assert.dom('nav[data-test-side-nav]').exists('The nav element is rendered');
    });

    test('it renders splattributes', async assert => {
        await render(hbs`<SideNav data-for-a-test="foo" />`);

        assert.dom('nav[data-test-side-nav][data-for-a-test="foo"]').exists('The nav element contains splattributes');
    });

    test('it yielded component render splattributes', async assert => {
        await render(hbs`
            <SideNav as |nav|>
                <nav.link data-for-a-test="bar" @route="home" @icon="home" @label="test" />
            </SideNav>
        `);

        assert.dom('nav a[data-for-a-test="bar"]').exists('The yieled element contains splattributes');
    });
});
