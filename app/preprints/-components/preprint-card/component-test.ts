import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { OsfLinkRouterStub } from 'ember-osf-web/tests/integration/helpers/osf-link-router-stub';

module('Integration | Component | preprint-card', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.store = this.owner.lookup('service:store');
        this.intl = this.owner.lookup('service:intl');
    });

    test('it renders', async function(this: TestContext, assert) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        const preprint = server.create('preprint', {
            tags: ['a', 'b', 'c'],
            description: 'Through the night',
        });
        server.create('contributor', { preprint, index: 0, bibliographic: true });
        server.create('contributor', { preprint, index: 1, bibliographic: true });
        server.create('contributor', { preprint, index: 2, bibliographic: true });
        const preprintModel = await this.store.findRecord(
            'preprint', preprint.id, { include: ['bibliographic_contributors'] },
        );
        this.set('preprint', preprintModel);

        await render(hbs`
            <Preprints::-Components::PreprintCard
                @preprint={{this.preprint}}
                @showTags={{true}}
            />
        `);
        assert.dom('[data-test-preprint-title]').exists('Preprint title exists');
        assert.dom('[data-test-preprint-title]').hasText(preprintModel.title, 'Node title is corrent');
        assert.dom('[data-test-contributors-label]').exists('Contributors label exists');
        assert.dom('[data-test-contributors-label]').hasText(
            this.intl.t('node_card.contributors'),
            'Contributors label is correct',
        );
    });
});
