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
        const action = 'edit_description';
        server.create('log', {
            id: action,
            action,
        });

        const mirageLog = server.schema.logs.find(action) as ModelInstance<LogModel>;
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

    /*
     "action": "guid_metadata_updated",
            "params": {
                "contributors": [],
                "guid": "8bxre",
                "params_node": {
                    "id": "8bxre",
                    "title": "Into embargo"
                },
                "params_project": null,
                "pointer": null,
                "preprint_provider": null,
                "title": "Into embargo",
                "updated_fields": {
                    "language": {
                        "new": "abk",
                        "old": ""
                    },
                    "resource_type_general": {
                        "new": "Audiovisual",
                        "old": ""
                    }
                },
                "urls": {
                    "view": "/8bxre"
                }
            }
                */

    test('it renders and shows license_changed', async function(this: ComponentTestContext, assert) {
        const action = 'license_changed';
        server.create('log', {
            id: action,
            action,
        });

        const mirageLog = server.schema.logs.find(action) as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger updated the license of A new project for testing file components Apache License 2.0',
            'Project edit description is correct',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM', 'The activity date is correct',
        );
    });

    test('it renders and shows osf_storage_file_added', async function(this: ComponentTestContext, assert) {
        const action = 'osf_storage_file_added';
        server.create('log', {
            id: action,
            action,
        });

        const mirageLog = server.schema.logs.find(action) as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger added file /hat.jpg to OSF Storage in A new project for testing file components',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows osf_storage_file_removed', async function(this: ComponentTestContext, assert) {
        const action = 'osf_storage_file_removed';
        server.create('log', {
            id: action,
            action,
        });

        const mirageLog = server.schema.logs.find(action) as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger removed file /hat.jpg from OSF Storage in A new project for testing file components',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });

    test('it renders and shows tag_added', async function(this: ComponentTestContext, assert) {
        const action = 'tag_added';
        server.create('log', {
            id: action,
            action,
        });

        const mirageLog = server.schema.logs.find(action) as ModelInstance<LogModel>;

        this.setProperties({
            mirageLog,
        });
        await render(hbs`
<ActivityLog::-Components::ActivityLogDisplay
    @log={{this.mirageLog}}
/>
`);
        assert.dom('[data-test-action-text]').hasText(
            'Futa Geiger added tag Food to A new project for testing file components',
        );

        assert.dom('[data-test-action-date]').hasText(
            '2025-02-06 07:51 PM',
        );
    });
});
