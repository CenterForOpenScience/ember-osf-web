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
        // Given no list is provided
        // When the component is rendered
        this.set('statusFlowIndex', 1);
        this.set('displayAuthorAssertions', true);
        await render(hbs`
            <Preprints::-Components::Submit::PreprintStateMachine::StatusFlow
                @statusFlowIndex={{this.statusFlowIndex}}
                @displayAuthorAssertions={{this.displayAuthorAssertions}}
            />
        `);

        // Then the subject container is verified
        assert.dom('[data-test-title-and-file]').containsText('Title and File');
    });
});
