import { TestContext } from 'ember-test-helpers';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { percySnapshot } from 'ember-percy';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { setupIntl } from 'ember-intl/test-support';

const currentUserStub = Service.extend({
    user: {
        allowIndexing: null,
    },
});

module('Integration | routes | settings | account | -components | opt-out', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test('default allowIndexing: null', async function(this: TestContext, assert) {
        this.owner.register('service:currentUser', currentUserStub);
        await render(hbs`<Settings::Account::-Components::OptOut />`);

        assert.dom('[data-test-opt-out-panel]').exists('opt-out panel exists');
        assert.dom('[data-test-opt-out-panel] [data-test-panel-heading]')
            .hasText(
                'Opt out of SHARE indexing',
                'title is correct',
            );
        assert.dom('[data-test-opt-out-help-text]').exists('description exists');
        assert.dom('[data-test-indexing-opt-out-label]').containsText(
            'Opt out of SHARE indexing', 'opt out label is correct',
        );
        assert.dom('[data-test-indexing-opt-in-label]').containsText(
            'Opt in to SHARE indexing', 'opt in label is correct',
        );
        assert.dom('[data-test-indexing-opt-out-label] input').isNotChecked('Opt out radio button is not checked');
        assert.dom('[data-test-indexing-opt-in-label] input').isNotChecked('Opt in radio button is not checked');
        assert.dom('[data-test-update-indexing-preference-button]').containsText(
            'Update', 'update button is correct',
        );
        await percySnapshot(assert);
    });
});
