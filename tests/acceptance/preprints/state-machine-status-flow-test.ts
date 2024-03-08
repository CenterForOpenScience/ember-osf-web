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

    function findSelectedClass(testAgent: EnginesTestContext, dataTestSelector: string): boolean {
        const testElement = testAgent.element.querySelector(`[${dataTestSelector}]`);
        const regexp = new RegExp(/.*?selected.*?/, 'g');
        return regexp.test(testElement?.className || '');
    }

    hooks.beforeEach(function(this: EnginesTestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
    });

    test('it displays the title and file status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 1
        // And the displayAuthorAssertions is true
        this.set('manager', Object({
            statusFlowIndex: 1,
            displayAuthorAssertions: true,
        }));
        // When the component is rendered
        await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
        `);

        // Then the title and file is verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.true(findSelectedClass(this, 'data-test-title-and-file'), 'The select class exists');

        // And the other fields are verified
        assert.dom('[data-test-metadata]').containsText('Metadata');
        assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.false(findSelectedClass(this, 'data-test-author-assertions'), 'The select class does not exist');

        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.false(findSelectedClass(this, 'data-test-supplements'), 'The select class does not exist');

        assert.dom('[data-test-review]').containsText('Review');
        assert.false(findSelectedClass(this, 'data-test-review'), 'The select class does not exist');
    });

    test('it displays the metadata status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 2
        // And the displayAuthorAssertions is true
        this.set('manager', Object({
            statusFlowIndex: 2,
            displayAuthorAssertions: true,
        }));
        // When the component is rendered
        await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
        `);

        // Then the metadata is verified
        assert.dom('[data-test-metadata]').containsText('Metadata');
        assert.true(findSelectedClass(this, 'data-test-metadata'), 'The select class exists');

        // And the other fields are verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.false(findSelectedClass(this, 'data-test-author-assertions'), 'The select class does not exist');

        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.false(findSelectedClass(this, 'data-test-supplements'), 'The select class does not exist');

        assert.dom('[data-test-review]').containsText('Review');
        assert.false(findSelectedClass(this, 'data-test-review'), 'The select class does not exist');
    });

    test('it displays the author assertions status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 3
        // And the displayAuthorAssertions is true
        this.set('manager', Object({
            statusFlowIndex: 3,
            displayAuthorAssertions: true,
        }));
        // When the component is rendered
        await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
        `);

        // Then the author assertions is verified
        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.true(findSelectedClass(this, 'data-test-author-assertions'), 'The select class exists');


        // And the other fields are verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

        assert.dom('[data-test-metadata]').containsText('Metadata');
        assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.false(findSelectedClass(this, 'data-test-supplements'), 'The select class does not exist');

        assert.dom('[data-test-review]').containsText('Review');
        assert.false(findSelectedClass(this, 'data-test-review'), 'The select class does not exist');
    });

    test('it displays the supplements status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 4
        // And the displayAuthorAssertions is true
        this.set('manager', Object({
            statusFlowIndex: 4,
            displayAuthorAssertions: true,
        }));
        // When the component is rendered
        await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
        `);

        // Then the supplements is verified
        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.true(findSelectedClass(this, 'data-test-supplements'), 'The select class exists');

        // And the other fields are verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

        assert.dom('[data-test-metadata]').containsText('Metadata');
        assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.false(findSelectedClass(this, 'data-test-author-assertions'), 'The select class does not exist');

        assert.dom('[data-test-review]').containsText('Review');
        assert.false(findSelectedClass(this, 'data-test-review'), 'The select class does not exist');
    });

    test('it display the supplements status when displayAuthorAssertions is false',
        async function(this: EnginesTestContext,assert) {
            // Given the statusFlowIndex is 2
            // And the displayAuthorAssertions is false
            this.set('manager', Object({
                statusFlowIndex: 3,
                displayAuthorAssertions: false,
            }));
            // When the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
            `);

            // Then the supplements is verified
            assert.dom('[data-test-supplements]').containsText('Supplements');
            assert.true(findSelectedClass(this, 'data-test-supplements'), 'The select class exists');

            // And the other fields are verified
            assert.dom('[data-test-title-and-file]').containsText('Title and File');
            assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

            assert.dom('[data-test-metadata]').containsText('Metadata');
            assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

            assert.dom('[data-test-author-assertions]').doesNotExist();

            assert.dom('[data-test-review]').containsText('Review');
            assert.false(findSelectedClass(this, 'data-test-review'), 'The select class does not exist');
        });


    test('it displays the Review status', async function(this: EnginesTestContext,assert) {
        // Given the statusFlowIndex is 5
        // And the displayAuthorAssertions is true
        this.set('manager', Object({
            statusFlowIndex: 5,
            displayAuthorAssertions: true,
        }));
        // When the component is rendered
        await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
        `);

        // Then the review is verified
        assert.dom('[data-test-review]').containsText('Review');
        assert.true(findSelectedClass(this, 'data-test-review'), 'The select class exists');

        // And the other fields are verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
        assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

        assert.dom('[data-test-metadata]').containsText('Metadata');
        assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

        assert.dom('[data-test-author-assertions]').containsText('Author Assertions');
        assert.false(findSelectedClass(this, 'data-test-author-assertions'), 'The select class does not exist');

        assert.dom('[data-test-supplements]').containsText('Supplements');
        assert.false(findSelectedClass(this, 'data-test-supplements'), 'The select class does not exist');

    });

    test('it display the review status when displayAuthorAssertions is false',
        async function(this: EnginesTestContext,assert) {
            // Given the statusFlowIndex is 4
            // And the displayAuthorAssertions is false
            this.set('manager', Object({
                statusFlowIndex: 4,
                displayAuthorAssertions: false,
            }));
            // When the component is rendered
            await render(hbs`
<Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
    @manager={{this.manager}}
/>
            `);

            // Then the review is verified
            assert.dom('[data-test-review]').containsText('Review');
            assert.true(findSelectedClass(this, 'data-test-review'), 'The select class exists');

            // And the other fields are verified
            assert.dom('[data-test-title-and-file]').containsText('Title and File');
            assert.false(findSelectedClass(this, 'data-test-title-and-file'), 'The select class does not exist');

            assert.dom('[data-test-metadata]').containsText('Metadata');
            assert.false(findSelectedClass(this, 'data-test-metadata'), 'The select class does not exist');

            assert.dom('[data-test-author-assertions]').doesNotExist();

            assert.dom('[data-test-supplements]').containsText('Supplements');
            assert.false(findSelectedClass(this, 'data-test-supplements'), 'The select class does not exist');
        });
});
