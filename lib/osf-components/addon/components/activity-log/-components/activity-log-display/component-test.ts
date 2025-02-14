/* eslint-disable max-len */
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import {TestContext} from 'ember-intl/test-support';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import LogModel from 'ember-osf-web/models/log';

interface ComponentTestContext extends TestContext {
    log: LogModel;
}

module('Integration | Activity Log Display | Component | validate activity log', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
    });

    test('it renders and shows edit_description', async function(this: ComponentTestContext, assert) {
        const action = 'edit_description';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> edited description of <a href="/c2het">A new project for testing file components</a></span>',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM', 'The activity date is correct',
        );
    });

    test('it renders and shows license_changed', async function(this: ComponentTestContext, assert) {
        const action = 'license_changed';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> updated the license of <a href="/c2het">A new project for testing file components</a> to Apache License 2.0</span>',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_file_added', async function(this: ComponentTestContext, assert) {
        const action = 'osf_storage_file_added';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> added file /hat.jpg to OSF Storage in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows osf_storage_file_removed', async function(this: ComponentTestContext, assert) {
        const action = 'osf_storage_file_removed';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> removed file /hat.jpg from OSF Storage in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows tag_added', async function(this: ComponentTestContext, assert) {
        const action = 'tag_added';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> added tag Food to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows guid_metadata_updated', async function(this: ComponentTestContext, assert) {
        const action = 'guid_metadata_updated';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> updated metadata for <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows view_only_link_removed', async function(this: ComponentTestContext, assert) {
        const action = 'view_only_link_removed';
        const log = server.create('log', {
            action,
            anonymousLink: false,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> removed an anonymous view-only link to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows view_only_link_added', async function(this: ComponentTestContext, assert) {
        const action = 'view_only_link_added';
        const log = server.create('log', {
            action,
            anonymousLink: true,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> created an anonymous view-only link to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows pointer and pointer category', async function(this: ComponentTestContext, assert) {
        const action = 'pointer_created';
        const log = server.create('log', {
            action,
        });
        const mirageLog = await this.store.findRecord('log', log.id);

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasHtml(
            '<span><a href="/utu98/">Futa Geiger</a> created a link to analysis <a href="/ww3a2/">The linked node for testing</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });
});

