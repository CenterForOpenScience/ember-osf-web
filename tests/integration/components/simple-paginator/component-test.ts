import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import { module, test } from 'qunit';

module('Integration | Component | simple-paginator', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('stubAction', () => []);
    });

    test('it renders', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=2}}`);
        assert.dom(this.element).hasText('< Page 2 of 3 >');
    });

    test('if no more than 1 page, don\'t show paginator at all', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=1 curPage=1}}`);
        assert.dom(this.element).hasText('');
    });

    module('pagination button disabling', () => {
        test('first page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=1}}`);
            assert.dom('[class*="SimplePaginator__element"]:first-child button')
                .isDisabled('Previous page button disabled.');
            assert.dom('[class*="SimplePaginator__element"]:last-child button')
                .isNotDisabled('Next page button not disabled.');
        });

        test('middle page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=2}}`);
            assert.dom('[class*="SimplePaginator__element"]:first-child button')
                .isNotDisabled('Previous page button not disabled.');
            assert.dom('[class*="SimplePaginator__element"]:last-child button')
                .isNotDisabled('Next page button not disabled.');
        });

        test('last page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=3}}`);
            assert.dom('[class*="SimplePaginator__element"]:first-child button')
                .isNotDisabled('Previous page button not disabled.');
            assert.dom('[class*="SimplePaginator__element"]:last-child button')
                .isDisabled('Next page button disabled.');
        });
    });
});
