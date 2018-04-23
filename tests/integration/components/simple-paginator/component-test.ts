import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
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
        assert.ok(this.element.innerHTML.includes('2'));
    });

    test('paginating disabled when no next, previous pages', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=2}}`);
        assert.ok(!this.element.innerHTML.includes('disabled'));

        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=3 curPage=1}}`);
        assert.ok(this.element.innerHTML.includes('disabled'));

        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=2 curPage=2}}`);
        assert.ok(this.element.innerHTML.includes('disabled'));
    });

    test('if no more than 1 page, don\'t show paginator at all', async function(assert) {
        await render(hbs`{{simple-paginator nextPage=stubAction previousPage=stubAction maxPage=1 curPage=1}}`);
        assert.equal((this.element.textContent as string).trim(), '');
    });
});
