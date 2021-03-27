import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from '../../helpers/osf-link-router-stub';

module('Integration | Component | node-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
    });

    test('it renders', async function(this: TestContext, assert) {
        this.owner.register('service:router', OsfLinkRouterStub);
        const registration = server.create('registration', {
            tags: ['a', 'b', 'c'],
            description: 'Through the night',
        }, 'withContributors');
        const registrationModel = await this.store.findRecord(
            'registration', registration.id, { include: ['bibliographic_contributors'] },
        );
        this.set('node', registrationModel);

        await render(hbs`
            <NodeCard
                @node={{this.node}}
                @showTags={{true}}
                @delete={{this.delete}}
            />
        `);
        assert.dom('[data-test-node-title]').exists();
        assert.dom('[data-test-node-title]').hasText(registrationModel.title);
        assert.dom('[data-test-schema-label]').exists();
        assert.dom('[data-test-schema-label]').hasText(this.intl.t('node_card.schema'));
        assert.dom('[data-test-schema-name]').exists();
        assert.dom('[data-test-schema-name]').hasTextContaining(registrationModel.registrationSchema.get('name'));
        await this.pauseTest();
    });
});
