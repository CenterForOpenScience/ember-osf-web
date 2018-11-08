import { click, render } from '@ember/test-helpers';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

/* tslint:disable:only-arrow-functions */
module('Registries | Integration | Component | side-nav', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it renders', async function(assert) {
        await render(hbs`<SideNav />`);

        assert.dom('nav[data-test-side-nav]').exists('The nav element is rendered');
    });

    test('it collapses and uncollapses', async function(assert) {
        await render(hbs`<SideNav />`);

        assert.dom('nav[data-test-side-nav][data-test-collapsed="false"]').exists('The nav element is not collapsed');

        await click('[data-test-toggle][role="button"]');

        assert.dom('nav[data-test-side-nav][data-test-collapsed="true"]').exists('The nav element is collapsed');

        await click('[data-test-toggle][role="button"]');

        assert.dom('nav[data-test-side-nav][data-test-collapsed="false"]').exists('The nav element is not collapsed');
    });

    test('it passed collapsed to yielded components', async function(assert) {
        await render(hbs`
            <SideNav as |nav|>
                <nav.link-to data-test="1" @icon="home" @label="test" />
            </SideNav>
        `);

        assert.dom('nav [data-test="1"][data-test-collapsed="false"]').exists('The yielded component is not collapsed');

        await click('[data-test-toggle][role="button"]');

        assert.dom('nav [data-test="1"][data-test-collapsed="true"]').exists('The yielded component is collapsed');

        await click('[data-test-toggle][role="button"]');

        assert.dom('nav [data-test="1"][data-test-collapsed="false"]').exists('The yielded component is not collapsed');
    });

    test('it renders splattributes', async function(assert) {
        await render(hbs`<SideNav data-for-a-test="foo" />`);

        assert.dom('nav[data-test-side-nav][data-for-a-test="foo"]').exists('The nav element contains splattributes');
    });

    test('it yielded component render splattributes', async function(assert) {
        await render(hbs`
            <SideNav as |nav|>
                <nav.link-to data-for-a-test="bar" @icon="home" @label="test" />
            </SideNav>
        `);

        assert.dom('nav a[data-for-a-test="bar"]').exists('The yieled element contains splattributes');
    });
});
