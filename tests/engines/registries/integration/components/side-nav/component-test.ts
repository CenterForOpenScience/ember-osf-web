/* eslint-disable max-classes-per-file */
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { TestContext } from 'ember-test-helpers';
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

class CurrentUserStub extends Service {}

const headTagsStub = Service.extend({
    collectHeadTags: () => { /* noop */ },
});

module('Registries | Integration | Component | side-nav', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', RouterStub);
        this.owner.register('service:osf-router', RouterStub);
        this.owner.register('service:current-user', CurrentUserStub);
        this.owner.register('service:head-tags', headTagsStub);
    });

    test('it renders', async assert => {
        await render(hbs`<SideNav />`);

        assert.dom('nav[data-test-side-nav]').exists('The nav element is rendered');
    });

    test('it renders badges', async assert => {
        await render(hbs`<OpenResource @hasResource={{this.registration.hasData}}
        @registration={{@registration}}
        @resourceType='data' />`);

        assert.dom('[data-test-resource-badge]').exists('Resource badge is rendered');
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
/* eslint-enable max-classes-per-file */
