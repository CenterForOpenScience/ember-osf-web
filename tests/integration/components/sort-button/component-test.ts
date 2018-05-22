import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | sort button', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
        this.set('sortAction', () => assert.ok(true));
    });

    test('selected works with sortBy', async function(assert) {
        await render(hbs`{{sort-button sortAction=sortAction sortBy='kindness' sort='-kindndess'}}`);

        assert.equal(this.$('button').length, 2);
        assert.ok(
            this.$('button')[0].className.includes('not-selected'),
            'sortBy doesn\'t match, should be unselected',
        );
    });
});
