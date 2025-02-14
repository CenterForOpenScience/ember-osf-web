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

    test('it renders and shows nothing with an empty object', async function(this: ComponentTestContext, assert) {
        const action = 'edit_description';
        const log = server.create('log', {
            action,
        }, 'empty');
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
            '<span><a href="/utu98/">Futa Geiger</a> edited description of </span>',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM', 'The activity date is correct',
        );
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
            '2025-02-06 01:51 PM', 'The activity date is correct',
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
            '2025-02-06 01:51 PM', 'The activity date is correct',
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
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
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
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
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
            '<span><a href="/utu98/">Futa Geiger</a> added tag <a href="/search?q=%22Food%22">Food</a> to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
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
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
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
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
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
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows pointer and pointer category', async function(this: ComponentTestContext, assert) {
        const action = 'pointer_created';
        const log = server.create('log', {
            action,
        }, 'linkedNode');
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
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows affiliated institution added', async function(this: ComponentTestContext, assert) {
        const action = 'affiliated_institution_added';
        const log = server.create('log', {
            action,
        }, 'institution');
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
            '<span><a href="/utu98/">Futa Geiger</a> added <a href="/institutions/guid">Institution Name</a> affiliation to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows preprint file updated', async function(this: ComponentTestContext, assert) {
        const action = 'preprint_file_updated';
        const log = server.create('log', {
            action,
        }, 'preprint');
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
            '<span><a href="/utu98/">Futa Geiger</a> updated the primary file of this <a href="/3s8sfsl">Preprint</a> on <a href="/preprint-provider-url">Preprint Provider</a> Preprints</span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows preprint license updated', async function(this: ComponentTestContext, assert) {
        const action = 'preprint_license_updated';
        const log = server.create('log', {
            action,
        }, 'preprint');
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
            '<span><a href="/utu98/">Futa Geiger</a> updated the license of this <a href="/3s8sfsl">Preprint</a> on <a href="/preprint-provider-url">Preprint Provider</a> Preprints Apache License 2.0</span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows template', async function(this: ComponentTestContext, assert) {
        const action = 'created_from';
        const log = server.create('log', {
            action,
        }, 'templateNode');
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
            '<span><a href="/utu98/">Futa Geiger</a> created <a href="/c2het">A new project for testing file components</a> based on <a href="/ww3a2/">The template node for testing</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows forked from', async function(this: ComponentTestContext, assert) {
        const action = 'node_forked';
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
            '<span><a href="/utu98/">Futa Geiger</a> created fork from <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });
});

