import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';

type Context = TestContext & { server: Server };

module('Integration | Component | paginated-list/all', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.server = startMirage();
    });

    hooks.afterEach(function(this: Context) {
        this.server.shutdown();
    });

    test('it renders', async function(this: Context, assert) {
        this.server.createList('node', 10);

        await render(hbs`
            {{#paginated-list/all modelName='node' as |list|}}
                {{#list.item as |node|}}
                    <span data-test-foo-item>{{node.id}}</span>
                {{/list.item}}
            {{/paginated-list/all}}
        `);

        assert.dom('[data-test-foo-item]', this.element).exists({ count: 10 });
    });

    test('it renders ul', async function(this: Context, assert) {
        this.server.createList('node', 10);

        await render(hbs`
            {{#paginated-list/all isTable=false modelName='node' as |list|}}
                {{#list.item as |node|}}
                    <span data-test-foo-item>{{node.id}}</span>
                {{/list.item}}
            {{/paginated-list/all}}
        `);

        assert.dom('ul', this.element).exists({ count: 1 });
        assert.dom('table', this.element).doesNotExist();
        assert.dom('thead', this.element).doesNotExist();
        assert.dom('tbody', this.element).doesNotExist();
    });

    test('it renders table', async function(this: Context, assert) {
        this.server.createList('node', 10);

        await render(hbs`
            {{#paginated-list/all isTable=true modelName='node' as |list|}}
                {{#list.item as |node|}}
                    <span data-test-foo-item>{{node.id}}</span>
                {{/list.item}}
            {{/paginated-list/all}}
        `);

        assert.dom('ul', this.element).doesNotExist();
        assert.dom('table', this.element).exists({ count: 1 });
        assert.dom('thead', this.element).doesNotExist();
        assert.dom('tbody', this.element).exists({ count: 1 });
    });
});
