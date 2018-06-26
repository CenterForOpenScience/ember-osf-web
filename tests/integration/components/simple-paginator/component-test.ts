import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | simple-paginator', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.set('stubAction', () => []);
    });

    test('it renders', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=2}}`);
        assert.hasText(this.element, 'Page 2 of 3');
    });

    test('if no more than 1 page, don\'t show paginator at all', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=1 curPage=1}}`);
        assert.notHasText(this.element);
    });

    module('pagination button disabling', () => {
        test('first page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=1}}`);
            assert.disabled(
                '[class*="SimplePaginator__element"]:first-child button',
                'Previous page button disabled.',
            );
            assert.notDisabled(
                '[class*="SimplePaginator__element"]:last-child button',
                'Next page button not disabled.',
            );
        });

        test('middle page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=2}}`);
            assert.notDisabled(
                '[class*="SimplePaginator__element"]:first-child button',
                'Previous page button not disabled.',
            );
            assert.notDisabled(
                '[class*="SimplePaginator__element"]:last-child button',
                'Next page button not disabled.',
            );
        });

        test('last page', async assert => {
            await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=3}}`);
            assert.notDisabled(
                '[class*="SimplePaginator__element"]:first-child button',
                'Previous page button not disabled.',
            );
            assert.disabled(
                '[class*="SimplePaginator__element"]:last-child button',
                'Next page button disabled.',
            );
        });
    });
});
