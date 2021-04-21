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
        });
        server.create('contributor', { node: registration, index: 0, bibliographic: true });
        server.create('contributor', { node: registration, index: 1, bibliographic: true });
        server.create('contributor', { node: registration, index: 2, bibliographic: true });
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
        assert.dom('[data-test-node-title]').exists('Node title exists');
        assert.dom('[data-test-node-title]').hasText(registrationModel.title, 'Node title is corrent');
        assert.dom('[data-test-registration-template-label]').exists('Schema label exists');
        assert.dom('[data-test-registration-template-label]').hasText(
            this.intl.t('node_card.registration_template'), 'Schema label is correct',
        );
        assert.dom('[data-test-registration-template-name]').exists('Schema name exists');
        assert.dom('[data-test-registration-template-name]').hasTextContaining(
            registration.registrationSchema.name,
            'Schema name is correct',
        );
        assert.dom('[data-test-contributors-label]').exists('Contributors label exists');
        assert.dom('[data-test-contributors-label]').hasText(
            this.intl.t('node_card.contributors'),
            'Contributors label is correct',
        );
        for (const contributor of registration.contributors.models) {
            assert.dom(`[data-test-contributor-name='${contributor.users.id}']`).exists('Contributor name exists');
            assert.dom(`[data-test-contributor-name='${contributor.users.id}']`).hasTextContaining(
                contributor.users.familyName,
                'Contributor name is correct',
            );
        }
        assert.dom('[data-test-description-label]').exists('Description label exists');
        assert.dom('[data-test-description-label]').hasText(
            this.intl.t('node_card.description'),
            'Description label is correct',
        );
        assert.dom('[data-test-registration-description]').hasTextContaining(
            registration.description, 'Description is correct',
        );
        assert.dom('[data-test-tags-label]').exists('Tags label exists');
        assert.dom('[data-test-tags-label]').hasText(
            this.intl.t('node_card.tags'),
            'Tags label is correct',
        );
        for (const tag of registration.tags) {
            assert.dom(`[data-test-tags-widget-tag='${tag}']`).exists('Tag exists');
            assert.dom(`[data-test-tags-widget-tag='${tag}']`).hasText(tag, 'Tag is correct');
        }
        assert.dom(`[data-test-view-button='${registration.id}']`).exists('View button exists');
    });
});
