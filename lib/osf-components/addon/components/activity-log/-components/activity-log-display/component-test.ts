import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import {TestContext} from 'ember-intl/test-support';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';
import { ModelInstance } from 'ember-cli-mirage';
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

        server.create('log', {
            id: 'edit_description',
            action: 'edit_description',
        });

        const mirageLog = server.schema.logs.find('edit_description') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger edited description of A new project for testing file components',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM', 'The activity date is correct',
        );
    });

    test('it renders and shows license_changed', async function(this: ComponentTestContext, assert) {

        server.create('log', {
            id: 'license_changed',
            action: 'license_changed',
        }, 'license');

        const mirageLog = server.schema.logs.find('license_changed') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger updated the license of A new project for testing file components',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM', 'The activity date is correct',
        );
    });

    /*
    test('it renders and shows osf_storage_file_added', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('osf_storage_file_added') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_file_added', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('osf_storage_file_added') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_file_removed', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('osf_storage_file_removed') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_file_updated', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('osf_storage_file_updated') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_folder_created', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('osf_storage_folder_created') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows project_created', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('project_created') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows subjects_updated', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('subjects_updated') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows tag_added', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('project_created') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });

    test('it renders and shows tag_removed', async function(this: ComponentTestContext, assert) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');

        server.loadFixtures('logs');
        const mirageLog = server.schema.logs.find('project_created') as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger created The name of the node', 'Project created text is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2017-07-10 05:07 AM', 'The activity date is correct',
        );
    });
    */
});
