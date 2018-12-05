import { render } from '@ember/test-helpers';
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
