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
            '<span>A user edited description of </span>',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM', 'The activity date is correct',
        );
    });

    /*
    TODO I need help getting this to work
    test('it renders and shows user error', async function(this: ComponentTestContext, assert) {
        const action = 'edit_description';
        const user = server.create('user', {}, 'noLinks');
        const log = server.create('log', {
            action,
        });
        log.update({
            user,
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
            'done',
            // '<span>The Github User edited description of <a href="/c2het">A new project for testing file components</a></span>',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM', 'The activity date is correct',
        );
    });
    */

    test('it renders and shows github user', async function(this: ComponentTestContext, assert) {
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
            '<span>The Github User edited description of <a href="/c2het">A new project for testing file components</a></span>',
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
        }, 'withUser');
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

    test('it renders and shows edit_title', async function(this: ComponentTestContext, assert) {
        const action = 'edit_title';
        const log = server.create('log', {
            action,
        }, 'withUser', 'originalNode');
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
            '<span><a href="/utu98/">Futa Geiger</a> changed the title from <a href="/ww3a2/">The original node for testing</a> to <a href="/ww3a2/">The new title</a></span>',
            'Project edit title is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM', 'The activity date is correct',
        );
    });

    test('it renders and shows license_changed', async function(this: ComponentTestContext, assert) {
        const action = 'license_changed';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
        }, 'withUser', 'addFile');
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
            '<span><a href="/utu98/">Futa Geiger</a> added file <a href="/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het">hat.jpg</a> to OSF Storage in <a href="/c2het">A new project for testing file components</a></span>',
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
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> removed folder the-folder from OSF Storage in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows file_removed', async function(this: ComponentTestContext, assert) {
        const action = 'file_removed';
        const log = server.create('log', {
            action,
        }, 'withUser', 'addFile');
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
            '<span><a href="/utu98/">Futa Geiger</a> removed file hat.jpg from <a href="/c2het">A new project for testing file components</a></span>',
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
        }, 'withUser');
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
        }, 'withUser');
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
        }, 'withUser');
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
        }, 'withUser');
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
        }, 'withUser', 'linkedNode');
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
        }, 'withUser', 'institution');
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
        }, 'withUser', 'preprint');
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
        }, 'withUser', 'preprint');
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
        }, 'withUser', 'templateNode');
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
        }, 'withUser');
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

    test('it renders and shows external ids added doi and ark', async function(this: ComponentTestContext, assert) {
        const action = 'external_ids_added';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> created external identifier(s) doi:doi and ark:ark on <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows external ids added doi and no ark', async function(this: ComponentTestContext, assert) {
        const action = 'external_ids_added';
        const log = server.create('log', {
            action,
        }, 'withUser', 'identifiersNoArk');
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
            '<span><a href="/utu98/">Futa Geiger</a> created external identifier(s) doi:doi on <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows external ids added ark and no doi', async function(this: ComponentTestContext, assert) {
        const action = 'external_ids_added';
        const log = server.create('log', {
            action,
        }, 'withUser', 'identifiersNoDoi');
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
            '<span><a href="/utu98/">Futa Geiger</a> created external identifier(s) ark:ark on <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows addon added', async function(this: ComponentTestContext, assert) {
        const action = 'addon_added';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> added addon The add on to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki deleted', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_deleted';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> deleted wiki page the page name of <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki deleted - no pages', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_deleted';
        const log = server.create('log', {
            action,
        }, 'withUser', 'noPage');
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
            '<span><a href="/utu98/">Futa Geiger</a> deleted wiki page a title of <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki renamed', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_renamed';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> renamed wiki page the old page name to <a href="/page-id-1">the page name</a> of <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki renamed - no pages', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_renamed';
        const log = server.create('log', {
            action,
        }, 'withUser', 'noPage');
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
            '<span><a href="/utu98/">Futa Geiger</a> renamed wiki page a title to a title of <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki updated', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_updated';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> updated wiki page <a href="/page-id-1">the page name</a> to version 348 of <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows wiki updated - no pages', async function(this: ComponentTestContext, assert) {
        const action = 'wiki_updated';
        const log = server.create('log', {
            action,
        }, 'withUser', 'noPage');
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
            '<span><a href="/utu98/">Futa Geiger</a> updated wiki page a title to version # of <a href="/c2het">A new project for testing file components</a></span>'
            ,
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows checked in', async function(this: ComponentTestContext, assert) {
        const action = 'checked_in';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> checked in the kind <a href="/c2het/files/osfstorage/6786c8874fde462e7f1ec489/?pid=c2het">the-folder</a> to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows addon file copied', async function(this: ComponentTestContext, assert) {
        const action = 'addon_file_copied';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> copied source-materialized-link in the source addon to <a href="/the-destination-url">/destination-materialized-link</a> in the destination addon in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows addon file copied - no source or destination', async function(this: ComponentTestContext, assert) {
        const action = 'addon_file_copied';
        const log = server.create('log', {
            action,
        }, 'withUser', 'noSource');
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
            '<span><a href="/utu98/">Futa Geiger</a> copied a name/location to a new name/location in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows addon file moved', async function(this: ComponentTestContext, assert) {
        const action = 'addon_file_moved';
        const log = server.create('log', {
            action,
        }, 'withUser', 'destinationSlash');
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
            '<span><a href="/utu98/">Futa Geiger</a> moved source-materialized-link in the source addon to a-trailing-slash in the destination addon in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows comment_added - file', async function(this: ComponentTestContext, assert) {
        const action = 'comment_added';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> added a comment on <a href="/file-url">file name</a> in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows comment_added - wiki', async function(this: ComponentTestContext, assert) {
        const action = 'comment_removed';
        const log = server.create('log', {
            action,
        }, 'withUser', 'wiki');
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
            '<span><a href="/utu98/">Futa Geiger</a> deleted a comment on wiki page <a href="/wiki-url">wiki name</a> in <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });

    test('it renders and shows contributor_added', async function(this: ComponentTestContext, assert) {
        const action = 'contributor_added';
        const log = server.create('log', {
            action,
        }, 'withUser');
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
            '<span><a href="/utu98/">Futa Geiger</a> added <a href="/1/">Alice Johnson</a>, GuestUser42, <a href="/3/">Charlie Brown</a>, and 2 others as contributor(s) to <a href="/c2het">A new project for testing file components</a></span>',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 01:51 PM',
        );
    });
});

