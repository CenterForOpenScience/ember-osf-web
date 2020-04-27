/* eslint-disable max-classes-per-file */
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

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
module('Integration | Component | registries-side-nav', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', RouterStub);
        this.owner.register('service:current-user', CurrentUserStub);
    });

    test('it renders', async assert => {
        await render(hbs`<OsfLayout::RegistriesSideNav />`);

        assert.dom('nav[data-test-side-nav]').exists('The nav element is rendered');
    });

    test('it renders splattributes', async assert => {
        await render(hbs`<OsfLayout::RegistriesSideNav data-for-a-test="foo" />`);

        assert.dom('nav[data-test-side-nav][data-for-a-test="foo"]').exists('The nav element contains splattributes');
    });

    test('it yielded component render splattributes', async assert => {
        await render(hbs`
            <OsfLayout::RegistriesSideNav as |nav|>
                <nav.link data-for-a-test="bar" @route="home" @icon="home" @label="test" />
            </OsfLayout::RegistriesSideNav>
        `);

        assert.dom('nav a[data-for-a-test="bar"]').exists('The yielded element contains splattributes');
    });
});
/* eslint-enable max-classes-per-file */
