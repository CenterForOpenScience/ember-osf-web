import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';

module('Integration | Component | sort-arrow', function(hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(async function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
        this.set('noop', () => {/* noop */});
    });

    test('it renders the correct icon when ascending', async function(assert) {
    // Set properties before rendering the component
        this.set('sortBy', 'user_name');
        this.set('sort', 'user_name');

        // Render the component
        await render(hbs`<SortArrow @sort={{this.sort}} @sortBy={{this.sortBy}} />`);

        // Assert that the component is rendered with the correct data-test-sort attribute
        assert
            .dom('[data-test-sort="user_name"]')
            .exists('The sort arrow button is rendered with the correct data-test-sort attribute');

        // Assert that the correct icon is displayed for ascending sort
        assert
            .dom('[data-test-sort="user_name"] [data-icon="arrow-up"]')
            .exists('Displays the correct arrow-up icon when sort is ascending');
    });

    test('it renders the correct icon when descending', async function(assert) {
        this.set('sortBy', 'user_name');
        this.set('sort', '-user_name');

        await render(hbs`<SortArrow @sort={{this.sort}} @sortBy={{this.sortBy}} />`);

        assert
            .dom('[data-test-sort="user_name"]')
            .exists('The sort arrow button is rendered with the correct data-test-sort attribute');

        assert
            .dom('[data-test-sort="user_name"] [data-icon="arrow-down"]')
            .exists('Displays the correct arrow-down icon when sort is descending');
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
            .hasAttribute('title', 'Sort descending', 'The correct title attribute is applied when ascending');
        assert
            .dom('[data-test-sort="user_name"]')
            .hasAttribute('aria-label', 'Sort descending', 'The correct aria-label is applied when ascending');
    });
});
