import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { OsfLinkRouterStub } from '../../../../../helpers/osf-link-router-stub';

module('Integration | routes | meetings | index | -components | meetings-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it renders and paginates', async assert => {
        server.createList('meeting', 11);

        await render(hbs`<Meetings::Index::-Components::MeetingsList />`);

        assert.dom('[data-test-meetings-list-header-name]')
            .exists({ count: 1 }, '1 name header');
        assert.dom('[data-test-meetings-list-header-submissions]')
            .exists({ count: 1 }, '1 submissions header');
        assert.dom('[data-test-meetings-list-header-location]')
            .exists({ count: 1 }, '1 location header');
        assert.dom('[data-test-meetings-list-header-date]')
            .exists({ count: 1 }, '1 date header');

        assert.dom('[data-test-meetings-list-item-name]')
            .exists({ count: 10 }, '10 meetings in the list with a name');
        assert.dom('[data-test-meetings-list-item-submissions]')
            .exists({ count: 10 }, '10 meetings in the list with submissions');
        assert.dom('[data-test-meetings-list-item-location]')
            .exists({ count: 10 }, '10 meetings in the list with a location');
        assert.dom('[data-test-meetings-list-item-date]')
            .exists({ count: 10 }, '10 meetings in the list with dates');

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-meetings-list-item-name]')
            .exists({ count: 1 }, '1 meeting in the list with a name');
        assert.dom('[data-test-meetings-list-item-submissions]')
            .exists({ count: 1 }, '1 meeting in the list with submissions');
        assert.dom('[data-test-meetings-list-item-location]')
            .exists({ count: 1 }, '1 meeting in the list with a location');
        assert.dom('[data-test-meetings-list-item-date]')
            .exists({ count: 1 }, '1 meeting in the list with dates');
    });

    test('it searches', async function(assert) {
        server.create('meeting', { name: 'Meeting A' });
        server.create('meeting', { name: 'Meeting B' });
        server.create('meeting', { name: 'Meeting C' });

        this.set('search', 'Meeting B');
        await render(hbs`<Meetings::Index::-Components::MeetingsList @search={{this.search}} />`);

        assert.dom('[data-test-meetings-list-item-name]')
            .exists({ count: 1 }, '1 meeting');
        assert.dom('[data-test-meetings-list-item-name]')
            .hasText('Meeting B', 'Meeting name matches search term');
    });

    test('it sorts', async assert => {
        server.create('meeting', {
            name: 'Meeting B',
            submissionsCount: 9,
            location: 'Place C',
            startDate: new Date('2003-01-02'),
        });
        server.create('meeting', {
            name: 'Meeting C',
            submissionsCount: 8,
            location: 'Place D',
            startDate: new Date('2001-01-02'),
        });
        server.create('meeting', {
            name: 'Meeting D',
            submissionsCount: 7,
            location: 'Place A',
            startDate: new Date('2000-01-02'),
        });
        server.create('meeting', {
            name: 'Meeting A',
            submissionsCount: 6,
            location: 'Place B',
            startDate: new Date('2002-01-02'),
        });

        await render(hbs`<Meetings::Index::-Components::MeetingsList />`);

        assert.dom('[data-test-meetings-list-item-name]')
            .exists({ count: 4 }, '4 meetings');

        await click('[data-test-ascending-sort="name"]');
        assert.dom('[data-test-meetings-list-item-name]')
            .hasText('Meeting A', 'Sorts by name ascending');

        await click('[data-test-descending-sort="name"]');
        assert.dom('[data-test-meetings-list-item-name]')
            .hasText('Meeting D', 'Sorts by name descending');

        await click('[data-test-ascending-sort="submissions_count"]');
        assert.dom('[data-test-meetings-list-item-submissions]')
            .hasText('6', 'Sorts by submissions ascendening');

        await click('[data-test-descending-sort="submissions_count"]');
        assert.dom('[data-test-meetings-list-item-submissions]')
            .hasText('9', 'Sorts by submissions descendening');

        await click('[data-test-ascending-sort="location"]');
        assert.dom('[data-test-meetings-list-item-location]')
            .hasText('Place A', 'Sorts by location ascendening');

        await click('[data-test-descending-sort="location"]');
        assert.dom('[data-test-meetings-list-item-location]')
            .hasText('Place D', 'Sorts by location descendening');

        await click('[data-test-ascending-sort="start_date"]');
        assert.dom('[data-test-meetings-list-item-date]')
            .containsText('2000 -', 'Sorts by date ascendening');

        await click('[data-test-descending-sort="start_date"]');
        assert.dom('[data-test-meetings-list-item-date]')
            .containsText('2003 -', 'Sorts by date descendening');
    });
});
