import { render } from '@ember/test-helpers';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, skip, test } from 'qunit';

module('Integration | Component | file browser', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        manualSetup(this);
    });

    test('test name\'s column width', async function(assert) {
        this.set('user', FactoryGuy.make('user'));
        this.set('display', ['header']);
        await render(hbs`{{file-browser  user=user display=display}}`);
        assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '12');
    });

    skip('test name\'s column width (share-link-column)', async function(assert) {
        this.set('user', FactoryGuy.make('user'));
        this.set('display', ['header', 'share-link-column']);
        await render(hbs`{{file-browser  user=user display=display}}`);
        assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '11');
    });

    skip('test name\'s column width (default)', async function(assert) {
        // Test default behavior
        this.set('user', FactoryGuy.make('user'));
        await render(hbs`{{file-browser user=user}}`);
        assert.equal(this.$('div:contains("Name")').html().split('col-xs-')[1].split(' ')[0], '6');
    });
});
