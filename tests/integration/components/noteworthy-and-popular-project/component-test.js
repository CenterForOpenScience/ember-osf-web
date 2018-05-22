import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

module('Integration | Component | noteworthy and popular project', function(hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function() {
        manualSetup(this);
    });

    test('it renders', async function(assert) {
        this.set('project', FactoryGuy.make('node'));
        await render(hbs`{{noteworthy-and-popular-project project=project}}`);
        assert.ok(this.$().text().trim());
    });
});
