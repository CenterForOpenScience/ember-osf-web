<% if (testType === 'integration') { %>import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

module('<%= friendlyTestDescription %>', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{<%= componentPathName %>}}`);

        assert.dom(this.element).hasText('');

        // Template block usage:
        await render(hbs`
            {{#<%= componentPathName %>}}
                template block text
            {{/<%= componentPathName %>}}
        `);

        assert.dom(this.element).hasText('template block text');
    });
});<% } else if (testType === 'unit') { %>import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('<%= friendlyTestDescription %>', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const component = this.owner.factoryFor('component:<%= componentPathName %>').create();
        assert.ok(component);
    });
});<% } %>
