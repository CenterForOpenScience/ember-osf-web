import { render } from '@ember/test-helpers';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | noteworthy-and-popular-project', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        manualSetup(this);
    });

    test('it renders', async function(assert) {
        this.set('node', FactoryGuy.make('node'));
        await render(hbs`{{noteworthy-and-popular-project node=this.node}}`);
        assert.dom('[class*="NoteworthyProject"]').exists();
    });
});
