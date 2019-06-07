import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest, skip } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | routes | meetings | detail | -components | meeting-submissions-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders and paginates', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            submissions: server.createList('meeting-submission', 15),
        });
        const model = { taskInstance: this.store.findRecord('meeting', 'testmeeting') };
        this.set('model', model);
        await render(hbs`<Meetings::Detail::-Components::MeetingSubmissionsList @model={{this.model}} />`);

        assert.dom('[data-test-submissions-list-header-title]')
            .exists({ count: 1 }, '1 title header');
        assert.dom('[data-test-submissions-list-header-author]')
            .exists({ count: 1 }, '1 author header');
        assert.dom('[data-test-submissions-list-header-category]')
            .exists({ count: 1 }, '1 category header');
        assert.dom('[data-test-submissions-list-header-date]')
            .exists({ count: 1 }, '1 date header');
        assert.dom('[data-test-submissions-list-header-download]')
            .exists({ count: 1 }, '1 download header');

        assert.dom('[data-test-submissions-list-item-title]')
            .exists({ count: 10 }, '10 submissions in the list with a title');
        assert.dom('[data-test-submissions-list-item-author]')
            .exists({ count: 10 }, '10 submissions in the list with an author');
        assert.dom('[data-test-submissions-list-item-category]')
            .exists({ count: 10 }, '10 submissions in the list with a category');
        assert.dom('[data-test-submissions-list-item-date]')
            .exists({ count: 10 }, '10 submissions in the list with a date');
        assert.dom('[data-test-submissions-list-item-download]')
            .exists({ count: 10 }, '10 submissions in the list with download counts');

        await click('[data-test-next-page-button]');

        assert.dom('[data-test-submissions-list-item-title]')
            .exists({ count: 5 }, '5 submissions in the list with a title');
        assert.dom('[data-test-submissions-list-item-author]')
            .exists({ count: 5 }, '5 submissions in the list with an author');
        assert.dom('[data-test-submissions-list-item-category]')
            .exists({ count: 5 }, '5 submissions in the list with a category');
        assert.dom('[data-test-submissions-list-item-date]')
            .exists({ count: 5 }, '5 submissions in the list with a date');
        assert.dom('[data-test-submissions-list-item-download]')
            .exists({ count: 5 }, '5 submissions in the list with download counts');
    });

    // TODO: Unskip this once we implement 'or' filtering in mirage.
    skip('it searches', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            submissions: [
                server.create('meeting-submission', {
                    title: 'red yellow green', authorName: 'purple', meetingCategory: 'poster',
                }),
                server.create('meeting-submission', {
                    title: 'not green', authorName: 'yellow', meetingCategory: 'poster',
                }),
                server.create('meeting-submission', {
                    title: 'not red', authorName: 'purple', meetingCategory: 'yellow',
                }),
                server.create('meeting-submission', {
                    title: 'Forever young', authorName: 'Blackpink', meetingCategory: 'Kpop',
                }),
            ],
        });
        const model = { taskInstance: this.store.findRecord('meeting', 'testmeeting') };
        this.set('model', model);
        this.set('search', 'yellow');
        await render(hbs`<Meetings::Detail::-Components::MeetingSubmissionsList @model={{this.model}} />`);

        assert.dom('[data-test-submissions-list-item-title]')
            .exists({ count: 3 }, '3 submissions');
        assert.dom('[data-test-submissions-list-item-title]')
            .hasText('red yellow green', 'submission title matches search term');
        assert.dom('[data-test-submissions-list-item-author]')
            .hasText('yellow', 'submission author matches search term');
        assert.dom('[data-test-submissions-list-item-category]')
            .hasText('yellow', 'submission category matches search term');
    });

    test('it sorts', async function(assert) {
        server.create('meeting', {
            id: 'testmeeting',
            name: 'Test Meeting',
            submissions: [
                server.create('meeting-submission', {
                    title: 'a',
                    authorName: 'Jisoo',
                    meetingCategory: 'poster',
                    downloadCount: 100,
                    created: new Date(2017, 1, 1),
                }),
                server.create('meeting-submission', {
                    title: 'b',
                    authorName: 'Lisa',
                    meetingCategory: 'poster',
                    downloadCount: 300,
                    created: new Date(2018, 1, 1),
                }),
                server.create('meeting-submission', {
                    title: 'c',
                    authorName: 'Rosé',
                    meetingCategory: 'talk',
                    downloadCount: 250,
                    created: new Date(2019, 1, 1),
                }),
            ],
        });

        const model = { taskInstance: this.store.findRecord('meeting', 'testmeeting') };
        this.set('model', model);

        await render(hbs`<Meetings::Detail::-Components::MeetingSubmissionsList @model={{this.model}} />`);

        assert.dom('[data-test-submissions-list-item-title]')
            .exists({ count: 3 }, '3 submissions');

        await click('[data-test-ascending-sort="title"]');
        assert.dom('[data-test-submissions-list-item-title]')
            .hasText('a', 'Sorts by title ascending');

        await click('[data-test-descending-sort="title"]');
        assert.dom('[data-test-submissions-list-item-title]')
            .hasText('c', 'Sorts by title descending');

        await click('[data-test-ascending-sort="author_name"]');
        assert.dom('[data-test-submissions-list-item-author]')
            .hasText('Jisoo', 'Sorts by author ascending');

        await click('[data-test-descending-sort="author_name"]');
        assert.dom('[data-test-submissions-list-item-author]')
            .hasText('Rosé', 'Sorts by author descending');

        await click('[data-test-ascending-sort="meeting_category"]');
        assert.dom('[data-test-submissions-list-item-category]')
            .hasText('poster', 'Sorts by category ascending');

        await click('[data-test-descending-sort="meeting_category"]');
        assert.dom('[data-test-submissions-list-item-category]')
            .hasText('talk', 'Sorts by category descending');

        await click('[data-test-ascending-sort="created"]');
        assert.dom('[data-test-submissions-list-item-date]')
            .containsText('2017', 'Sorts by date ascending');

        await click('[data-test-descending-sort="created"]');
        assert.dom('[data-test-submissions-list-item-date]')
            .containsText('2019', 'Sorts by date descending');

        await click('[data-test-ascending-sort="download_count"]');
        assert.dom('[data-test-submissions-list-item-download]')
            .hasText('100', 'Sorts by download_count ascending');

        await click('[data-test-descending-sort="download_count"]');
        assert.dom('[data-test-submissions-list-item-download]')
            .hasText('300', 'Sorts by download_count descending');
    });
});
