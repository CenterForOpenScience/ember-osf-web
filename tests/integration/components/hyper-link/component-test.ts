import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | hyper-link', hooks => {
    setupRenderingTest(hooks);

    test('it renders ember routes', async assert => {
        await render(hbs`{{osf-navbar/x-links/hyper-link foo}}`);

        assert.dom('a').exists();
    });

    test('it renders external hrefs', async assert => {
        await render(hbs`{{osf-navbar/x-links/hyper-link 'http://example.com'}}`);

        assert.dom('a[href="http://example.com"]').exists();
    });

    test('it renders internal hrefs', async assert => {
        await render(hbs`{{osf-navbar/x-links/hyper-link '/'}}`);

        assert.dom('a[href="/"]').exists();
    });

    test('it does not render when hidden=true', async function(this: TestContext, assert) {
        this.set('isHidden', true);

        await render(hbs`{{osf-navbar/x-links/hyper-link hidden=isHidden}}`);

        assert.dom('a').doesNotExist();

        this.set('isHidden', false);
        assert.dom('a').exists();

        this.set('isHidden', true);
        assert.dom('a').doesNotExist();
    });

    test('it renders `text`', async assert => {
        await render(hbs`{{osf-navbar/x-links/hyper-link text='This is my text'}}`);

        assert.dom('a').hasText('This is my text');
    });

    test('it renders yields', async assert => {
        await render(hbs`
            {{#osf-navbar/x-links/hyper-link text='This is my text'}}
                This is not my text
            {{/osf-navbar/x-links/hyper-link}}
        `);

        assert.dom('a').hasText('This is not my text');
    });

    test('it allows overriding route when curried', async assert => {
        await render(hbs`
            {{#let (
                hash
                link=(component 'osf-navbar/x-links/hyper-link' 'http://example.com/#override-me' text='Override Me')
            ) as |ctx|}}
                {{ctx.link route='http://example.com/#overridden' text='Overridden'}}
            {{/let}}
        `);

        assert.dom('a').hasText('Overridden');
        assert.dom('a[href="http://example.com/#overridden"]').exists();
    });
});
