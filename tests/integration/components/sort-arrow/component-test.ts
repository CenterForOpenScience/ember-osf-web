import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | sort-arrow', function(hooks) {
    setupRenderingTest(hooks);

    test('it renders without any content by default', async function(assert) {
        await render(hbs`<SortArrow />`);

        assert.dom('[data-test-sort]').exists('The sort arrow renders correctly');
        assert
            .dom('[data-test-sort]')
            .hasNoText('It has no text by default');
    });

    test('it renders with block content', async function(assert) {
        await render(hbs`
      <SortArrow>
        Block content
      </SortArrow>
    `);

        assert
            .dom(this.element)
            .hasText('Block content', 'The sort arrow renders block content correctly');
    });

    test('it renders the correct icon and state when ascending', async function(assert) {
        this.set('sortBy', 'user_name');
        this.set('sort', 'user_name');
        await render(hbs`<SortArrow @sort={{this.sort}} @sortBy={{this.sortBy}} />`);

        assert
            .dom('[data-test-sort="user_name"] .fa-icon')
            .hasClass('fa-arrow-up', 'Displays the correct arrow-up icon when sort is ascending');
    });

    test('it renders the correct icon and state when descending', async function(assert) {
        this.set('sortBy', 'user_name');
        this.set('sort', '-user_name');
        await render(hbs`<SortArrow @sort={{this.sort}} @sortBy={{this.sortBy}} />`);

        assert
            .dom('[data-test-sort="user_name"] .fa-icon')
            .hasClass('fa-arrow-down', 'Displays the correct arrow-down icon when sort is descending');
    });

    test('it triggers the sort action on click', async function(assert) {
        assert.expect(1);

        this.set('sortBy', 'user_name');
        this.set('sortAction', sortField => {
            assert.strictEqual(
                sortField,
                'user_name',
                'sortAction was called with the correct sort field',
            );
        });

        await render(hbs`<SortArrow @sortBy={{this.sortBy}} @sortAction={{this.sortAction}} />`);

        await click('[data-test-sort="user_name"]');
    });

    test('it applies the correct attributes and classes', async function(assert) {
        this.set('sortBy', 'user_name');
        this.set('sort', 'user_name');
        await render(hbs`<SortArrow @sort={{this.sort}} @sortBy={{this.sortBy}} />`);

        assert
            .dom('[data-test-sort="user_name"]')
            .hasAttribute('data-analytics-name', 'Sort user_name', 'The correct data-analytics-name is applied');
        assert
            .dom('[data-test-sort="user_name"]')
            .hasAttribute('title', 'Sort Descending', 'The correct title attribute is applied when ascending');
        assert
            .dom('[data-test-sort="user_name"]')
            .hasAttribute('aria-label', 'Sort Descending', 'The correct aria-label is applied when ascending');
    });
});
