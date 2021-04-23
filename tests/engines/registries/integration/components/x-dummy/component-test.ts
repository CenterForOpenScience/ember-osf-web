import { render, waitFor } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Registries | Integration | Component | x-dummy', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it binds data-* attributes', async function(this: TestContext, assert) {
        this.set('attr', 'bar');

        await render(hbs`
            {{#x-dummy data-attr=this.attr}}
                This is a test!
            {{/x-dummy}}
        `);

        assert.dom('[data-attr="bar"]').hasText('This is a test!');

        this.set('attr', 'foo');

        await waitFor('[data-attr="foo"]');

        assert.dom('[data-attr="foo"]').hasText('This is a test!');
    });

    test('it yields yieldValue', async assert => {
        await render(hbs`
            {{#x-dummy (html-attributes data-test-dummy='1') yieldValue='It works!' as |val|}}
                <p>{{val}}</p>
            {{/x-dummy}}
        `);

        assert.dom('[data-test-dummy="1"]').hasText('It works!');
    });

    test('it binds href', async assert => {
        await render(hbs`
            {{x-dummy tagName='a' href='example.com'}}
        `);

        assert.dom('a').hasAttribute('href', 'example.com');
    });
});
