import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesTestContext } from 'ember-engines/test-support';
import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';
import { setupRenderingTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import { module, test } from 'qunit';

module('Acceptance | preprints | state-machine | status-flow', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: EnginesTestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it displays the title and file status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 1
        // And the displayAuthorAssertions is true
        this.set('statusFlowIndex', 1);
        this.set('displayAuthorAssertions', true);
        // When the component is rendered
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the title and file is verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.dom('[data-test-metadata]').doesNotExist();
    });

    test('it displays the metadata status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 2
        // And the displayAuthorAssertions is true
        this.set('statusFlowIndex', 2);
        this.set('displayAuthorAssertions', true);
        // When the component is rendered
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the metadata is verified
        assert.dom('[data-test-title-and-file]').doesNotExist();
        assert.dom('[data-test-metadata]').containsText('Metadata');
    });

    test('it displays the author assertions status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 2
        // And the displayAuthorAssertions is true
        this.set('statusFlowIndex', 3);
        this.set('displayAuthorAssertions', true);
        // When the component is rendered
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the author assertions is verified
        assert.dom('[data-test-title-and-file]').doesNotExist();
        assert.dom('[data-test-metadata]').doesNotExist();
        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.dom('[data-test-supplements]').doesNotExist();
        assert.dom('[data-test-review]').doesNotExist();
    });

    test('it displays the supplements status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 4
        // And the displayAuthorAssertions is true
        this.set('statusFlowIndex', 4);
        this.set('displayAuthorAssertions', true);
        // When the component is rendered
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the metadata is verified
        assert.dom('[data-test-title-and-file]').doesNotExist();
        assert.dom('[data-test-metadata]').doesNotExist();
        assert.dom('[data-test-author-assertions]').doesNotExist();
        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.dom('[data-test-review]').doesNotExist();
    });

    test('it display the supplements status when displayAuthorAssertions is false',
        async function(this: EnginesTestContext,assert) {
            // Given the statusFlowIndex is 2
            // And the displayAuthorAssertions is false
            this.set('statusFlowIndex', 3);
            this.set('displayAuthorAssertions', false);
            // When the component is rendered
            await render(hbs`
                <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                    @statusFlowIndex={{this.statusFlowIndex}}
                    @displayAuthorAssertions={{this.displayAuthorAssertions}}
                />
            `);

            // Then the author assertions is verified
            assert.dom('[data-test-title-and-file]').doesNotExist();
            assert.dom('[data-test-metadata]').doesNotExist();
            assert.dom('[data-test-author-assertions]').doesNotExist();
            assert.dom('[data-test-supplements]').containsText('Supplements');
            assert.dom('[data-test-review]').doesNotExist();
        });


    test('it displays the Review status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 2
        // And the displayAuthorAssertions is true
        this.set('statusFlowIndex', 5);
        this.set('displayAuthorAssertions', true);
        // When the component is rendered
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the metadata is verified
        assert.dom('[data-test-title-and-file]').doesNotExist();
        assert.dom('[data-test-metadata]').doesNotExist('Metadata');
        assert.dom('[data-test-author-assertions]').doesNotExist();
        assert.dom('[data-test-supplements]').doesNotExist();
        assert.dom('[data-test-review]').containsText('Review');
    });

    test('it display the review status when displayAuthorAssertions is false',
        async function(this: EnginesTestContext,assert) {
            // Given the statusFlowIndex is 4
            // And the displayAuthorAssertions is false
            this.set('statusFlowIndex', 4);
            this.set('displayAuthorAssertions', false);
            // When the component is rendered
            await render(hbs`
                <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                    @statusFlowIndex={{this.statusFlowIndex}}
                    @displayAuthorAssertions={{this.displayAuthorAssertions}}
                />
            `);

            // Then the author assertions is verified
            assert.dom('[data-test-title-and-file]').doesNotExist();
            assert.dom('[data-test-metadata]').doesNotExist();
            assert.dom('[data-test-author-assertions]').doesNotExist();
            assert.dom('[data-test-supplements]').doesNotExist();
            assert.dom('[data-test-review]').containsText('Review');
        });

});
