import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | paginated-list/all', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(this, assert) {
        server.createList('node', 10);

        await render(hbs`
            {{#paginated-list/all modelName='node' as |list|}}
                {{#list.item as |node|}}
                    <span data-test-foo-item>{{node.id}}</span>
                {{/list.item}}
            {{/paginated-list/all}}
        `);

        assert.dom('[data-test-foo-item]', this.element).exists({ count: 10 });
    });

    test('it renders ul', async function(this, assert) {
        server.createList('node', 10);

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

    test('it renders table', async function(this, assert) {
        server.createList('node', 10);

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
