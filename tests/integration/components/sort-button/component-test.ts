import { findAll, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

module('Integration | Component | sort-button', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
        this.set('sortAction', () => assert.ok(true));
    });

    test('selected works with sortBy', async function(assert) {
        await render(hbs`{{sort-button sortAction=this.sortAction sortBy='kindness' sort='-kindndess'}}`);

        assert.equal(findAll('button').length, 2, 'Two buttons found.');
        assert.dom('button[title="Sort ascending"][class*="not-selected"]')
            .exists('Sort ascending button is not selected.');
        assert.dom('button[title="Sort descending"][class*="not-selected"]')
            .exists('Sort descending button is not selected.');
    });
});
